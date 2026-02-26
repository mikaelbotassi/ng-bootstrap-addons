import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, contentChild, TemplateRef, output, viewChild, effect, AfterViewInit, untracked } from '@angular/core';
import { ColumnFilterComponent } from '../column-filter/column-filter.component';
import { TableComponent } from '../../table.component';
import { ColumnFilterPredicate, ColumnFilterType, FilterFunction, SortDirection } from '../../models/table-models';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { FilterStateService } from '../../services/filter-state.service';
import { TablePreferencesService } from '../../public_api';
import { MultiselectOption } from 'ng-bootstrap-addons/selects';

@Component({
  selector: 'th[nbaColumnHeader]',
  templateUrl: './column-header.component.html',
  imports: [ColumnFilterComponent, BsDropdownDirective],
  styleUrls: ['./column-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FilterStateService]
})
export class ColumnHeaderComponent implements AfterViewInit {

  field = input.required<string>();
  type = input<ColumnFilterType|null>(null);
  sortable = input(true, {transform: booleanAttribute});
  onApplyFilter = output<string>();
  onClearFilter = output<void>();
  hydrated = false;
  options = input<MultiselectOption[]>([]);
  multiple = input(true, {transform:booleanAttribute});

  filter = contentChild<TemplateRef<any>>('filter');
    
  private table = inject(TableComponent, { skipSelf: true });

  isFiltered = computed(() => {
    const filters = this.table.filters();
    return filters && this.field() in filters;
  });
  
  sortDirection = computed(() => 
    this.table.sortField() === this.field() ? this.table.sortDirection() : null
  );

  ngAfterViewInit(): void {
    this.hydrated = true;
  }

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

    this.table.setSort(newDirection == null ? null : { field, direction: newDirection });
  }

  filterPredicate = input<ColumnFilterPredicate>();
  filterFunctionPredicate = computed(() => {
    const predicate = this.filterPredicate();
    const filterValue = this.filterState.value();
    if(!predicate) return null;
    return (item: any) => predicate(item, filterValue);
  })

  addFilter(event: FilterFunction|void) {
    if (!this.filter) return;
    const field = this.field();
    const fn = this.filterFunctionPredicate() ?? event;
    
    this.prefService.setFilterValue(field, this.filterState.value());
    if(fn) return this.table.setFilter(field, fn);
    this.onApplyFilter.emit(this.field());
  }

  removeFilter() {
    const field = this.field();
    this.table.clearFilter(field);
    this.onClearFilter.emit();
    this.prefService.removeFilterValue(field);
  }

  filterMenu = viewChild(ColumnFilterComponent);

  prefService = inject(TablePreferencesService);
  filterState = inject(FilterStateService);

  onPreferencesChange = effect(() => {
    const preferences = this.prefService.preferences();
    if(!preferences) return;
    const field = untracked(() => this.field());
    const filterStateValue = untracked(() => this.filterState.value());

    if(!this.hydrated) return;
    if(!preferences?.filters[field]){
      return;
    }
    if (preferences.filters[field] !== filterStateValue){
      if(filterStateValue == null) this.filterState.value.set(preferences.filters[field]);
      untracked(() => {
        this.addFilter(this.filterState.applyFilter(this.type()))
      });
    }

  });

}