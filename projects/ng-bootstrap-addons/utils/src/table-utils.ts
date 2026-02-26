type Key = string | number | boolean | Date | null | undefined;

export interface ListFilterConfig<TItem = any, TValue = any> {
  /** como extrair a chave do item da linha */
  itemKey?: (item: TItem) => Key;
  /** como extrair a chave do valor selecionado */
  valueKey?: (v: TValue) => Key;

  /** alternativa: path tipo 'representative.name' */
  itemKeyPath?: string;
  valueKeyPath?: string;

  /** normalização: por padrão, string vira lower+trim */
  normalize?: (k: Key) => string | number | boolean | null;
}

/** resolve path "a.b.c" sem explodir */
function getByPath(obj: any, path?: string): any {
  if (!obj || !path) return obj;
  return path.split('.').reduce((acc, p) => (acc == null ? acc : acc[p]), obj);
}

function defaultNormalize(k: Key): any {
  if (k == null) return null;
  if (k instanceof Date) return k.getTime();
  if (typeof k === 'string') return k.trim().toLowerCase();
  return k; // number/boolean
}

function buildLookupSet(values: any[], valueKeyFn: (v: any) => Key, normalize: (k: Key) => any) {
  const set = new Set<any>();
  for (const v of values) set.add(normalize(valueKeyFn(v)));
  return set;
}

export function listPredicate<TItem = any, TValue = any>(
  values: TValue[] | null | undefined,
  cfg: ListFilterConfig<TItem, TValue> = {}
) {
  if (!values?.length) {
    return (_item: TItem) => true;
  }

  const normalize = cfg.normalize ?? defaultNormalize;

  const itemKeyFn =
    cfg.itemKey ??
    ((item: any) => getByPath(item, cfg.itemKeyPath));

  const valueKeyFn =
    cfg.valueKey ??
    ((v: any) => getByPath(v, cfg.valueKeyPath));

  const lookup = buildLookupSet(values as any[], valueKeyFn, normalize);

  return (item: TItem) => {
    const key = normalize(itemKeyFn(item));
    return lookup.has(key);
  };
}