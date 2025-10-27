// tabset-layout.component.ts
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TabsetManagerService } from '../services/tabset-manager.service';

@Component({
  selector: 'app-tabset-layout',
  imports: [CommonModule, RouterOutlet, TabsModule],
  templateUrl: './tabset-layout.component.html',
})
export class TabsetLayoutComponent {
  private readonly tabsSrv = inject(TabsetManagerService);
  tabs = this.tabsSrv.tabs;
  activeId = computed(() => this.tabsSrv.activeTab()?.id ?? null);

  onSelect(tabId: string) {
    if (this.activeId() === tabId) return;
    this.tabsSrv.activateTab(tabId);
  }

  onRemove(tabId: string) {
    this.tabsSrv.closeTab(tabId);
  }
}
