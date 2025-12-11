import { inject, Type, computed, Signal } from '@angular/core';
import { PageStateService } from './page-state.service';

function toType(t: Type<any> | object): Type<any> {
  return (t as any).prototype ? (t as Type<any>) : (t as any).constructor as Type<any>;
}

export type PageState<T extends object = any> = {
  state: Signal<T | null>;
  setState: (state?: T, component?: Type<any>) => void;
  go: <U extends object = any>(component: Type<any>, state?: U | undefined) => void;
  navigate: (component: Type<any>) => void;
  goBack: () => void;
  service: PageStateService;
}

export function usePageState<T extends object = any>(componentOrType?: Type<any> | object): PageState<T> {
  const nav = inject(PageStateService);
  const targetComponent = componentOrType;

  return {
    state: computed(() => {
      const componentValue = targetComponent ?? nav.currentComponent();
      if (!componentValue) return null;
      const type = toType(componentValue);
      return nav.getStateByComponent<T>(type);
    }),
    setState: nav.setState.bind(nav),
    go: nav.go.bind(nav),
    goBack: nav.goBack.bind(nav),
    navigate: nav.navigate.bind(nav),
    service: nav
  };
}