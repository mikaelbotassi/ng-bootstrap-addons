import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, HostListener, contentChild, TemplateRef } from '@angular/core';
import { ColumnFilterComponent } from '../column-filter/column-filter.component';
import { TableComponent } from '../../table.component';
import { ColumnFilterType, FilterEvent, SortDirection } from '../../models/table-models';

@Component({
  selector: 'th[nbaColumnHeader]',
  templateUrl: './column-header.component.html',
  imports: [ColumnFilterComponent],
  styleUrls: ['./column-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnHeaderComponent {
  field = input.required<string>();
  type = input.required<ColumnFilterType>();
  sortable = input(true, {transform: booleanAttribute});

  filter = contentChild<TemplateRef<any>>('filter');
    
  private table = inject(TableComponent, { skipSelf: true });

  isFiltered = computed(() => {
    const filters = this.table.filters();
    return filters && this.field() in filters;
  });
  
  sortDirection = computed(() => 
    this.table.sortField() === this.field() ? this.table.sortDirection() : null
  );

  sort() {
    console.log('Sorting column:', this.field());
    if (!this.sortable()) return;
    
    const field = this.field();
    const currentDirection = this.sortDirection();
    
    let newDirection: SortDirection;
    
    if (currentDirection === null) {
      newDirection = 'asc';
    } else if (currentDirection === 'asc') {
      newDirection = 'desc';
    } else {
      newDirection = null;
    }

    this.table.onSort({ field, direction: newDirection });
  }

  addFilter(event: FilterEvent) {
    if (!this.filter) return;

    const field = this.field();

    this.table.setFilter(field, event.filterFn);
  }

  // ✅ Método para remover filtro
  removeFilter() {
    const field = this.field();
    this.table.clearFilter(field);
  }

}