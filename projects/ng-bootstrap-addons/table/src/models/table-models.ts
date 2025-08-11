export type ColumnFilterType = 'text' | 'date' | 'numeric' | 'boolean';

export type SortDirection = 'asc' | 'desc' | null;

export type SortEvent = {
  field: string;
  direction: SortDirection;
}

export type FilterEvent = {
  value: any,
  filterFn: FilterFunction
}

export type FilterFunction = (item: any) => boolean;