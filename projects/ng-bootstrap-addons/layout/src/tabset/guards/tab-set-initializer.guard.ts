import { CanActivateFn, Router } from "@angular/router";
import { TabRoute } from "../models/tab-route";
import { inject } from "@angular/core";
import { TabsetManagerService } from "../services/tabset-manager.service";

export const TabSetInitializerGuard: (tabs: TabRoute[]) => CanActivateFn = (tabs: TabRoute[]) => {
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