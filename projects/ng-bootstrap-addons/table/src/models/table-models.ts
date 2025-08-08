export type ColumnFilterType = 'text' | 'date' | 'numeric' | 'boolean' | 'dynamic';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortEvent {
  field: string;
  direction: SortDirection;
}