import { inject, Type } from "@angular/core";
import { ResolveFn, Route } from "@angular/router";
import { openTab, TabData } from "./tab-models";
import { createRandomString } from "ng-bootstrap-addons/utils";
import { TabsetManagerService } from "../services/tabset-manager.service";

export class TabRoute implements Route {
  path?: string;
  title?: Route['title'];
  component: Type<any>;
  data?: Record<string, any>;
  resolve?: Route['resolve'];
  canActivate?: Route['canActivate'];
  canActivateChild?: Route['canActivateChild'];
  canDeactivate?: Route['canDeactivate'];
  canMatch?: Route['canMatch'];
  children?: Route['children'];
  outlet?: string;
  redirectTo?: Route['redirectTo'];
  pathMatch?: 'prefix' | 'full';
  matcher?: Route['matcher'];
  tab: TabData;

  constructor(route: Omit<TabRoute, 'tab'> & { tab: Omit<TabData, 'component'|'id'>; }) {
    const dataKey = 'tab';
    Object.assign(this, route);
    this.component = route.component;
    this.tab = { ...route.tab, component: route.component, id: `tab-${createRandomString(12)}` };
    this.data = { ...(route.data ?? {}), [dataKey]: this.tab };
    this.resolve = {
      tabInit: TabInitializerResolver,
      ...(route.resolve ?? {}),
    }
  }
}

const TabInitializerResolver: ResolveFn<void> = (route) => {
  const tabManager = inject(TabsetManagerService);

  const tabConfig = route.data?.['tab'] as TabData | undefined;

  if (tabConfig) openTab(tabConfig, tabManager);

  return;
};