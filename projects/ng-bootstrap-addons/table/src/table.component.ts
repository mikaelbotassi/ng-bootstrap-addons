import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, contentChild, input, signal, TemplateRef } from '@angular/core';
import { SortDirection, SortEvent } from './models/table-models';

@Component({
  selector: 'nba-table',
  imports: [CommonModule],
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent<T = any> {
  value = input.required<T[] | undefined | null>();
  
  // Signals para ordenação (públicos para acesso das diretivas)
  sortField = signal<string | null>(null);
  sortDirection = signal<SortDirection>(null);
  
  // Dados processados (filtrados e ordenados)
  processedData = computed(() => {
    let data = this.value() || [];
    
    // Aplicar ordenação
    if (this.sortField() && this.sortDirection()) {
      data = this.sortData(data, this.sortField()!, this.sortDirection()!);
    }
    
    return data;
  });

  // Templates
  caption = contentChild<TemplateRef<any>>('caption');
  header = contentChild<TemplateRef<any>>('header');
  body = contentChild<TemplateRef<any>>('body');

  // Método público para ordenação (usado pelas diretivas)
  onSort(event: SortEvent) {
    this.sortField.set(event.field);
    this.sortDirection.set(event.direction);
  }

  private sortData(data: T[], field: string, direction: SortDirection): T[] {
    if (!direction) return data;
    
    return [...data].sort((a, b) => {
      const aValue = this.getFieldValue(a, field);
      const bValue = this.getFieldValue(b, field);
      
      let result = 0;
      
      if (aValue < bValue) result = -1;
      else if (aValue > bValue) result = 1;
      
      return direction === 'desc' ? -result : result;
    });
  }

  private getFieldValue(obj: any, field: string): any {
    return field.split('.').reduce((o, f) => o?.[f], obj);
  }
}