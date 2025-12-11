import { Component, computed, contentChildren } from '@angular/core';
import { TabRouteComponent } from './tab-route.component';

@Component({
  selector: 'app-tabset-route',
  template: `<ng-content/>`,
})
export class TabsetRouteComponent {
  
  customTabs = contentChildren(TabRouteComponent, { descendants: true });

  customTemplates = computed(() => {
    return (this.customTabs() ?? [])
      .map(tab => {
        const tpl = tab.template();
        const id  = tab.tabId();
        return tpl ? { tabId: id, template: tpl } : null;
      })
      .filter((x): x is { tabId: string; template: any } => !!x);
  });

}
