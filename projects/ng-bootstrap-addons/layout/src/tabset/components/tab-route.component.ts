import { Component, input, TemplateRef, viewChild } from '@angular/core';
import { Tab } from '../models/tab-models';

@Component({
  selector: 'app-tab-route',
  template: `<ng-template #tpl><ng-content/></ng-template>`
})
export class TabRouteComponent {

  tabId = input.required<Tab['id']>();
  template = viewChild<TemplateRef<unknown>>('tpl');
  
}
