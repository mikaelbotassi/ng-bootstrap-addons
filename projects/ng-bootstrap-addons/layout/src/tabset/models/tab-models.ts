import { Type } from '@angular/core';
import { TabsetManagerService } from '../services/tabset-manager.service';

export interface Tab {
  id: string;
  icon?:string;
  title: string;
  isActive: boolean;
  canClose: boolean;
  component: Type<any>;
  autoOpen: boolean;
  order?: number;
  data?: any;
}

export interface TabData {
  id: string;
  title: string;
  canClose?: boolean;
  icon?: string;
  component: Type<any>;
  data?: any;
  order?: number;
  autoOpen?: boolean;
}

export const openTab = (tabConfig: TabData, tabManager: TabsetManagerService) => {
  tabManager.ensureTab({
    id: tabConfig.id ?? `tab-${Date.now()}`,
    title: tabConfig.title ?? 'Nova Aba',
    component: tabConfig.component,
    autoOpen: (tabConfig.autoOpen ?? false) !== false,
    canClose: (tabConfig.canClose ?? true) !== false,
    data: tabConfig.data ?? null,
    icon: tabConfig.icon,
    order: tabConfig.order,
  });
}
