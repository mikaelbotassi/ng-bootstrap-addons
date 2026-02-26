export type ColumnFilterType = 'text' | 'date' | 'numeric' | 'boolean' | 'list' | 'text-suggestion';

export interface Column{
  field:string;
  header:string;
  visible?: boolean;
  type?:ColumnFilterType;
}

export type SortDirection = 'asc' | 'desc' | null;

export type SortEvent = {
  field: string;
  direction: SortDirection;
}

export type FilterFunction<T = any> = (value: T) => boolean;
export type ColumnFilterPredicate<T = any, V = T> = (item: T, value: V) => boolean
export type GlobalFilterFunction<T = any, V = any> = (value: T, term: V) => boolean;