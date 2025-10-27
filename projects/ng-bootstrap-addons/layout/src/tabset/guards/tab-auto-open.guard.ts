import { CanActivateFn } from "@angular/router";
import { TabRoute } from "../models/tab-route";
import { TabsetManagerService } from "../services/tabset-manager.service";
import { inject } from "@angular/core";
import { openTab } from "../models/tab-models";

export const TabAutoOpenGuard: (tabs: TabRoute[]) => CanActivateFn = (tabs: TabRoute[]) => {
  return () => {
    const tabManager = inject(TabsetManagerService);
    tabs.forEach(tabRoute => {
      const tabConfig = tabRoute.tab;
      if (tabConfig.autoOpen) {
        openTab(tabConfig, tabManager);
      }
    });
    return true;
  };
};