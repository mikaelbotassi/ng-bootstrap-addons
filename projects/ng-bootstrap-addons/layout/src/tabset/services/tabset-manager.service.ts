import { Injectable, computed, inject, signal } from '@angular/core';
import { Tab } from '../models/tab-models';
import { PageStateService } from 'ng-bootstrap-addons/services';

@Injectable()
export class TabsetManagerService {

  private readonly pageState = inject(PageStateService);

  private _tabs = signal<Tab[]>([]);
  private _activeTabId = signal<string | null>(null);

  readonly tabs = computed(() => this._tabs());
  readonly hasTabs = computed(() => this._tabs().length > 0);
  readonly activeTab = computed(() => {
    const id = this._activeTabId();
    return id ? this._tabs().find(t => t.id === id) ?? null : null;
  });

  ensureTab(tab: Omit<Tab, 'isActive'>): void {
    const tabs = this._tabs();
    const idx = tabs.findIndex(t => t.id === tab.id);

    if (idx >= 0) {
      const updated = { ...tabs[idx], ...tab };
      const newTabs = [...tabs];
      newTabs[idx] = updated;
      this._tabs.set(newTabs);
      this.setActiveById(tab.id);
    } else {
      const newTab: Tab = { ...tab, isActive: true };
      const newTabs = tabs.map(t => ({ ...t, isActive: false }));
      this._tabs.set([...newTabs, newTab]);
      this._activeTabId.set(newTab.id);
    }
  }

  activateTab(tabId: string): void {
    const tabs = this._tabs();
    const target = tabs.find(t => t.id === tabId);
    if (!target) return;

    this._tabs.set(tabs.map(t => ({ ...t, isActive: t.id === tabId })));
    this._activeTabId.set(tabId);
    this.pageState.navigate(target.component);
  }

  closeTab(tabId: string): void {
    const tabs = this._tabs();
    const idx = tabs.findIndex(t => t.id === tabId);
    if (idx === -1) return;

    const wasActive = this._activeTabId() === tabId;
    const remaining = tabs.filter(t => t.id !== tabId);

    if (!remaining.length) {
      this._tabs.set([]);
      this._activeTabId.set(null);
      return;
    }

    if (wasActive) {
      const newIdx = Math.min(idx, remaining.length - 1);
      const next = remaining[newIdx];
      this._tabs.set(remaining.map(t => ({ ...t, isActive: t.id === next.id })));
      this._activeTabId.set(next.id);

      this.pageState.go(next.component, next.data);
      return;
    }
    this._tabs.set(remaining);
  }

  updateTabData(tabId: string, data: any): void {
    const tabs = this._tabs();
    const updated = tabs.map(t => t.id === tabId ? { ...t, data } : t);
    this._tabs.set(updated);
  }

  reflectNavigation(): void {
    const component = this.pageState.currentComponent();
    if (!component) return;

    const tabs = this._tabs();
    const found = tabs.find(t => t.component === component);
    if (!found) return;

    if (this._activeTabId() !== found.id) {
      this._tabs.set(tabs.map(t => ({ ...t, isActive: t.id === found.id })));
      this._activeTabId.set(found.id);
    }
  }

  private setActiveById(tabId: string): void {
    const tabs = this._tabs();
    if (!tabs.length) return;
    this._tabs.set(tabs.map(t => ({ ...t, isActive: t.id === tabId })));
    this._activeTabId.set(tabId);
  }
}
