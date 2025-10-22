import { inject, Type } from '@angular/core';
import { CanActivateFn, ResolveFn, Route, Router } from '@angular/router';
import { TabsetManagerService } from '../services/tabset-manager.service';
import { createRandomString } from 'ng-bootstrap-addons/utils';
import { TabsetLayoutComponent } from '../components/tabset-layout.component';

export interface Tab {
  id: string;
  icon?:string;
  title: string;
  isActive: boolean;
  canClose: boolean;
  component: Type<any>;
  data?: any;
}

export interface TabData {
  id: string;
  title: string;
  canClose: boolean;
  icon?: string;
  component: Type<any>;
  data?: any;
}


/**
 * Classe “decoradora” de Route que injeta um objeto `tab` em `data[dataKey]`
 * e compõe o `canActivate` com o `TabInitializerGuard`.
 * Por padrão, `dataKey = 'initialTab'`.
 */

export class TabSetRoute implements Route {
  tabs: TabRoute[];
  path?: string;
  title?: Route['title'];
  component: Type<any>;
  children: Route['children'];
  providers?: Route['providers'];
  resolve?: Route['resolve'];
  canActivate?: Route['canActivate'];

  constructor(route: Omit<TabSetRoute, 'component' | 'children'>) {
    this.tabs = route.tabs;
    this.path = route.path;
    this.title = route.title;
    this.component = TabsetLayoutComponent;
    this.children = route.tabs;
    this.providers = [...(route.providers ?? []), TabsetManagerService];
    this.resolve = route.resolve;
    this.canActivate = [
      ...(route.canActivate ?? []),
      TabSetInitializerGuard(this.tabs)
    ];
  }
}

const TabSetInitializerGuard: (tabs: TabRoute[]) => CanActivateFn = (tabs: TabRoute[]) => {
  return (route, state) => {
    const router = inject(Router);
    const tabManager = inject(TabsetManagerService);

    const defaultTab = tabs.find(tab => tab.path === '');
    if (!defaultTab) return true;

    const targetUrl = state.url;
    const urlSegments = targetUrl.split('/').filter(Boolean);
    const initialPath = urlSegments[0];

    if (targetUrl === `/${initialPath}`) return true;

    if (tabManager.tabs().some(t => t.id === defaultTab.tab.id)) return true;

    router.navigate([`/${initialPath}`]);
    return false;

  };
};

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
  const tabData = tabConfig?.data ?? null;

  if (tabConfig) {
    tabManager.ensureTab({
      id: tabConfig.id ?? `tab-${Date.now()}`,
      title: tabConfig.title ?? 'Nova Aba',
      component: tabConfig.component,
      canClose: tabConfig.canClose !== false,
      data: tabConfig.data ?? null,
      icon: tabConfig.icon,
    });
  }

  return;
};
