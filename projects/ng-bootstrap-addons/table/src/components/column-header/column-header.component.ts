import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, HostListener, contentChild, TemplateRef, output } from '@angular/core';
import { ColumnFilterComponent } from '../column-filter/column-filter.component';
import { TableComponent } from '../../table.component';
import { ColumnFilterType, FilterFunction, SortDirection } from '../../models/table-models';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { FormStateService } from '../../services/form-state.service';

@Component({
  selector: 'th[nbaColumnHeader]',
  templateUrl: './column-header.component.html',
  imports: [ColumnFilterComponent, BsDropdownDirective],
  styleUrls: ['./column-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormStateService]
})
export class ColumnHeaderComponent {
  field = input.required<string>();
  type = input<ColumnFilterType|null>(null);
  sortable = input(true, {transform: booleanAttribute});
  onApplyFilter = output<string>();
  onClearFilter = output<void>();

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

  addFilter(event: FilterFunction|void) {
    if (!this.filter) return;

    const field = this.field();

    if(event) return this.table.setFilter(field, event);
    this.onApplyFilter.emit(this.field());
  }

  removeFilter() {
    const field = this.field();
    this.table.clearFilter(field);
    this.onClearFilter.emit();
  }

}