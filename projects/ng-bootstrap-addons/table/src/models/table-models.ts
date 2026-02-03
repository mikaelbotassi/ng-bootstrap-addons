export type ColumnFilterType = 'text' | 'date' | 'numeric' | 'boolean';

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

export type FilterFunction<T = any> = (item: T) => boolean;
export type GlobalFilterFunction<T = any, V = any> = (item: T, term: V) => boolean;