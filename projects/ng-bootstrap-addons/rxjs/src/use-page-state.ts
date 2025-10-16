import { inject, Type, computed, signal, effect, Signal } from '@angular/core';
import { PageStateService } from 'ng-bootstrap-addons/services';

function toType(t: Type<any> | object): Type<any> {
  return (t as any).prototype ? (t as Type<any>) : (t as any).constructor as Type<any>;
}

export type PageState<T extends object = any> = {
  state: Signal<T | null>;
  setState: (state?: T) => Promise<void>;
  go: (component: Type<any>, state?: T | undefined) => Promise<void>;
  goBack: () => Promise<void>;
  service: PageStateService;
}

export function usePageState<T extends object = any>(componentOrType?: Type<any> | object): PageState<T> {
  const nav = inject(PageStateService);
  const component = signal<Type<any> | object | undefined>(componentOrType);
  if (!componentOrType) {
    effect(async () => {
      component.set(await nav.currentComponentType() || undefined);
    });
  }

  return {
    state: computed(() => {
      const componentValue = component();
      if (!componentValue) return null;
      const type = toType(componentValue);
      const map = nav.stateBus();
      return (map.get(type) as T | null) ?? (window.history.state as T ?? null);
    }),
    setState: nav.setState.bind(nav),
    go: nav.go.bind(nav),
    goBack: nav.goBack.bind(nav),
    service: nav
  };
}
