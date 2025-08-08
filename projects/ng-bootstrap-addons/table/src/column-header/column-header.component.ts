import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, HostListener } from '@angular/core';
import { TableComponent } from '../table.component';
import { ColumnFilterComponent } from '../column-filter/column-filter.component';
import { ColumnFilterType, SortDirection } from '../models/table-models';

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
    
  private table = inject(TableComponent, { skipSelf: true });
  
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
}