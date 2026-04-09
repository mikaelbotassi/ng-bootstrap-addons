export type FieldMeta = {
  label?: string;
  groups?: readonly string[];   // ✅ multi-grupo
  order?: number;
  icon?: string;
  tooltip?: string;
};

type Ctor = new (...args: any[]) => any;

const FIELD_REGISTRY = new WeakMap<Function, Map<string, FieldMeta>>();

function getOrCreateMap(ctor: Function) {
  let map = FIELD_REGISTRY.get(ctor);
  if (!map) {
    map = new Map<string, FieldMeta>();
    FIELD_REGISTRY.set(ctor, map);
  }
  return map;
}

function normalizeGroups(groups?: string | readonly string[]) {
  if (!groups) return undefined;
  return (Array.isArray(groups) ? groups : [groups]).filter(Boolean);
}

export function Field(meta: Omit<FieldMeta, 'groups'> & { groups?: string | readonly string[] } = {}) {
  return function (target: any, propertyKey: string | symbol) {
    const ctor = target.constructor as Function;
    const map = getOrCreateMap(ctor);

    const key = String(propertyKey);
    const prev = map.get(key) ?? {};

    map.set(key, {
      ...prev,
      ...meta,
      groups: normalizeGroups(meta.groups ?? prev.groups),
    });
  };
}

function getMergedMetaMap(ctor: Function): Map<string, FieldMeta> {
  const merged = new Map<string, FieldMeta>();

  let cur: any = ctor;
  while (cur && cur !== Function.prototype) {
    const map = FIELD_REGISTRY.get(cur);
    if (map) {
      for (const [k, v] of map.entries()) {
        if (!merged.has(k)) merged.set(k, v);
      }
    }
    cur = Object.getPrototypeOf(cur);
  }

  return merged;
}

export function fieldsByGroup<T extends Ctor>(
  ctor: T,
  group: string
): Array<[keyof InstanceType<T>, FieldMeta]> {
  const map = getMergedMetaMap(ctor);

  return Array.from(map.entries())
    .filter(([, meta]) => (meta.groups ?? []).includes(group))
    .sort((a, b) => (a[1].order ?? 0) - (b[1].order ?? 0))
    .map(([k, v]) => [k, v] as any);
}

export function keysByGroup<T extends Ctor>(
  ctor: T,
  group: string
): Array<keyof InstanceType<T>> {
  return fieldsByGroup(ctor, group).map(([k]) => k);
}

export function fieldsByGroupVM<T extends Ctor>(
  ctor: T,
  group: string
): Array<{ field: keyof InstanceType<T>; label: string }> {
  return fieldsByGroup(ctor, group).map(([field, meta]) => ({
    field,
    label: meta.label ?? String(field),
  }));
}

export function allGroups<T extends Ctor>(ctor: T): string[] {
  const map = FIELD_REGISTRY.get(ctor);
  if (!map) return [];

  const groups = Array.from(map.values())
    .flatMap(m => m.groups ?? []);

  return [...new Set(groups)];
}