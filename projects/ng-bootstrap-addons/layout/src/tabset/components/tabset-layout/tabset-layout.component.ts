import { Component, computed, inject, TemplateRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TabsetRouteComponent } from '../tabset-route.component';
import { TabsetManagerService } from '../../services/tabset-manager.service';

@Component({
  selector: 'app-tabset-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TabsModule],
  templateUrl: './tabset-layout.component.html',
  styleUrl: `./tabset-layout.component.scss`,
  encapsulation: ViewEncapsulation.None
})
export class TabsetLayoutComponent {

  private readonly tabsSrv = inject(TabsetManagerService);
  tabs = this.tabsSrv.tabs;
  activeId = computed(() => this.tabsSrv.activeTab()?.id ?? null);
  tabsetRoute = inject(TabsetRouteComponent, {optional: true, skipSelf: true});
  customTabs = computed(() => {
    const tabset = this.tabsetRoute;
    if(!tabset) return [];
    return tabset.customTemplates();
  });

  existentCustomTabTemplate(tabId: string): TemplateRef<unknown> | undefined {
    const item = this.customTabs().find(tab => tab.tabId === tabId);
    return item?.template;
  }

  onSelect(tabId: string) {
    if (this.activeId() === tabId) return;
    this.tabsSrv.activateTab(tabId);
  }

  onRemove(tabId: string) {
    this.tabsSrv.closeTab(tabId);
  }
}