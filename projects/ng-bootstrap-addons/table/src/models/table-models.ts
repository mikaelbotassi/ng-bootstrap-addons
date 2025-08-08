export type ColumnFilterType = 'text' | 'date' | 'numeric' | 'boolean';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortEvent {
  field: string;
  direction: SortDirection;
}