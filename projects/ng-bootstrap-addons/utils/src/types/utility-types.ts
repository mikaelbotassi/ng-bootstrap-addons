export type OptionalAttribute<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type SN = 'S' | 'N';
export type KeysOfType<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never
}[keyof T];