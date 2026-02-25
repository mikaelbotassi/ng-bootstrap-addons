import { signal, Signal, WritableSignal } from '@angular/core';

export type BehaviorSignal<T> = Signal<T> & {
  set(value: T, prefs?: { emitEvent?: boolean }): void;
  update(fn: (value: T) => T, prefs?: { emitEvent?: boolean }): void;
  asReadonly(): Signal<T>;
};

export function behaviorSignal<T>(initialValue: T): BehaviorSignal<T> {
  let draft = initialValue;
  const published: WritableSignal<T> = signal<T>(initialValue);

  const bs = (() => draft) as BehaviorSignal<T>;

  bs.set = (value: T, prefs: { emitEvent?: boolean } = {}) => {
    const { emitEvent = true } = prefs;
    if (Object.is(draft, value)) return;
    draft = value;
    if (emitEvent) published.set(value);
  };

  bs.update = (fn, prefs) => bs.set(fn(draft), prefs);

  bs.asReadonly = () => published.asReadonly();

  return bs;
}