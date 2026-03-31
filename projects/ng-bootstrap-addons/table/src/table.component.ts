import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  model,
  signal,
  TemplateRef,
  ViewEncapsulation,
  inject,
  afterNextRender,
  Injector,
  runInInjectionContext,
  viewChild,
  untracked,
  OnInit,
  effect,
  viewChildren,
  contentChildren,
} from '@angular/core';
import { Column, FilterFunction, GlobalFilterFunction, SortDirection, SortEvent } from './models/table-models';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from 'ng-bootstrap-addons/pagination';
import { createNestedObject } from 'ng-bootstrap-addons/utils';
import { MultiselectOption } from 'ng-bootstrap-addons/selects';
import { ColumnMultiselectComponent } from './components/column-multiselect/column-multiselect.component';
import { TablePreferencesService } from './services/table-preferences.service';
import { ColumnHeaderComponent } from './components/column-header/column-header.component';
import { DragScrollDirective } from 'ng-bootstrap-addons/directives';

@Component({
  selector: 'nba-table',
  imports: [CommonModule, FormsModule, DragScrollDirective, PaginationComponent, ColumnMultiselectComponent],
  providers: [TablePreferencesService],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TableComponent<T extends Object = any> implements OnInit {

  id = input<string>();

  ngOnInit(): void {
    if(this.id()) this.prefService.init(this.id()!);
  }
  
  value = input.required<T[] | undefined | null>();

  // =========================
  // #region ORDENAÇÃO
  // =========================
  sortField = signal<string | null>(null);
  sortDirection = signal<SortDirection>(null);

  setSort(event: SortEvent|null, setPreferences = true) {
    if(setPreferences) this.prefService.setSort(event);
    if(!event) {
      this.sortField.set(null);
      this.sortDirection.set(null);
      this._resetToFirstPageNextRender()
      return;
    }
    this.sortField.set(event.field);
    this.sortDirection.set(event.direction);
    this._resetToFirstPageNextRender()
  }

  private sortData(data: T[], field: string, direction: SortDirection): T[] {
    if (!direction) return data;
    return [...data].sort((a, b) => {
      const aValue = this.getFieldValue(a, field);
      const bValue = this.getFieldValue(b, field);
      const result = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return direction === 'desc' ? -result : result;
    });
  }
  // #endregion

  // =========================
  // #region FILTROS GLOBAIS
  // =========================

  globalFilterFields = input<string[]>([]);
  globalFilterFunction = input<GlobalFilterFunction | null>(null);
  globalFilter = model<any>(null);

  // quanto tempo esperar após a última tecla (ms)
  globalFilterDebounceMs = input<number>(300);

  // handle interno do debounce
  private _gfTimer: any = null;

  onGlobalFilterChange(value: any) {
    // reinicia o timer a cada digitação
    clearTimeout(this._gfTimer);
    const delay = this.globalFilterDebounceMs();

    this._gfTimer = setTimeout(() => {
      this.globalFilter.set(value);
      this._resetToFirstPageNextRender();
    }, delay);
  }

  globalFilterData(data: T[]): T[] {
    const fields = this.globalFilterFields();
    if (!fields?.length) return data;

    const term = (typeof this.globalFilter() === 'string') ? String(this.globalFilter()).trim().toLowerCase() : this.globalFilter();
    if (!term) return data;

    const custom = this.globalFilterFunction();

    if (custom) {
      // Se o dev passou (entity, term), usamos; se passou só (entity), ele pode fechar sobre o termo externamente
      return data.filter((entity) =>
        fields.some((field) => {
          const v = this.getFieldValue(entity, field);
          return custom(v, term)
        })
      );
    }

    // default: busca em múltiplos campos
    return data.filter((entity) =>
      fields.some((field) => {
        const v = this.getFieldValue(entity, field);
        return v != null && String(v).trim().toLowerCase().includes(term);
      })
    );
  }


  // =========================
  // #region FILTROS
  // =========================
  filters = signal<Record<string, FilterFunction>>({});

  setFilter(field: string, fn: FilterFunction) {
    this.filters.update(curr => ({ ...curr, [field]: fn }));
    this._resetToFirstPageNextRender();
  }

  clearFilter(field: string) {
    this.filters.update(({ [field]: _removed, ...rest }) => rest);
    this._resetToFirstPageNextRender();
  }

  showClearFiltersButton = input(true, {transform:booleanAttribute});

  clearFilters() {
    this.filters.set({});
    this.sortField.set(null);
    this.sortDirection.set(null);
    this.globalFilter.set(null);
    this.prefService.clearFilters();
    this._resetToFirstPageNextRender();
  }

  private filterData(data: T[], field: string, filterFunc: FilterFunction): T[] {
    return data.filter(entity => filterFunc(this.getFieldValue(entity, field)));
  }
  // #endregion
  // =========================
  // #region DADOS (processamento)
  // =========================
  sortedData = computed(() => {
    let data = this.value() ?? [];
    
    // ordenação
    if (this.sortField() && this.sortDirection()) return this.sortData(data, this.sortField()!, this.sortDirection()!);
    return data;

  });

  filteredData = computed(() => {
    let data = this.sortedData();

    // filtros
    const filters = this.filters();
    if (Object.keys(filters).length > 0) {
      for (const [field, fn] of Object.entries(filters)) {
        if (fn && field.length > 0) data = this.filterData(data, field, fn);
      }
    }
    if(this.globalFilter()) data = this.globalFilterData(data);
    return data;
  });
  // #endregion

  // =========================
  // #region PAGINATION (query param)
  // =========================
  urlParam = input<string>('page');
  syncWithUrl = input(true, { transform: booleanAttribute });
  paginated = input(true, { transform: booleanAttribute });
  itemsPerPage = model(10);
  currentPage = model(1);
  private paginationComponent = viewChild<PaginationComponent<T>>('pg');
  private injector = inject(Injector);

  private _resetToFirstPageNextRender() {
    runInInjectionContext(this.injector, () => {
      afterNextRender(() => {
        this.paginationComponent()?.firstPage();
      });
    });
  }
  // #endregion

  // =========================
  // #region SELECT ROWS
  // =========================

  private normalizeSelectionValue(rowOrValue: any): any {
    const raw = rowOrValue?.value ?? rowOrValue;

    if (!this.selectionField()) {
      return raw;
    }
    
    if (raw == null || typeof raw !== 'object') {
      return raw;
    }

    return this.getFieldValue(raw, this.selectionField()!);
  }

  multiple = input(false, { transform: booleanAttribute });
selectionField = input<string | null>();
selectRowsScope = input<SelectRowsScope>('page');

selectableRows = computed(() => {
  switch (this.selectRowsScope()) {
    case 'page':
      return this.rows();
    case 'filtered':
      return this.filteredData();
    default:
      return this.value() ?? [];
  }
});

selectedRows = model<any[]>([]);

selectRow(row: any) {
  const rowValue = this.normalizeSelectionValue(row);
  const exists = this.selectedRows().includes(rowValue);

  if (exists) {
    this.selectedRows.update(current =>
      current.filter(item => item !== rowValue)
    );
    return;
  }

  if (!this.multiple()) {
    this.selectedRows.set([rowValue]);
    return;
  }

  this.selectedRows.update(current => [...current, rowValue]);
}

deselectRow(row: any) {
  const rowValue = this.normalizeSelectionValue(row);

  this.selectedRows.update(current =>
    current.filter(item => item !== rowValue)
  );
}

unselectAllRows = () => this.selectedRows.set([]);

selectAllRows = () => {
  const values = this.selectableRows().map(row =>
    this.normalizeSelectionValue(row)
  );

  this.selectedRows.set(values);
};

toggleSelectAllRows = () => {
  if (this.areAllRowsSelected()) {
    this.unselectAllRows();
  } else {
    this.selectAllRows();
  }
};

areAllRowsSelected = computed(() => {
  const rows = this.selectableRows();
  const selected = this.selectedRows();

  if (!rows.length) return false;

  return rows.every(row => {
    const value = this.normalizeSelectionValue(row);
    return selected.includes(value);
  });
});
  // #endregion

  // =========================
  // #region UTIL
  // =========================
  getFieldValue(obj: any, field: string): any {
    return field.split('.').reduce((o, f) => o?.[f], obj);
  }

  formatNumber(n: number) {
    return new Intl.NumberFormat('pt-BR').format(n);
  }
  // #endregion

  // =========================
  // #region TEMPLATES PROJETADOS
  // =========================
  caption = contentChild<TemplateRef<any>>('caption');
  hasCaption = computed(()=>{
    return !!this.caption() || this.showClearFiltersButton() || this.globalFilterFields().length || this.columns();
  });
  header  = contentChild<TemplateRef<any>>('header');
  body    = contentChild<TemplateRef<any>>('body');
  // #endregion

  // =========================
  // #region TOGGLE COLUMNS
  // =========================
  columnHeaders = contentChildren(ColumnHeaderComponent, {descendants:true});

  columns = model<Column[]|null|undefined>(null);
  columnsOptions = computed(() => this.columns()?.map((item) => new MultiselectOption({
    value: item.field,
    label: item.header
  })) ?? []);
  selectedColumnFields = model<string[]>([]);
  visibleColumns = computed(() => {
    const columns = this.columns();
    if(!columns) return [];
    const selected = this.selectedColumnFields();
    const newArray = [];
    for(var i = 0; i < selected.length; i++){
      const selectedField = selected[i];
      const column = columns.find(item => item.field === selectedField);
      if(!column) continue;
      newArray.push(column);
    }
    return newArray;
  });
  onSelectedCollumnsChange = effect(() => {
    const selected = this.selectedColumnFields();
    this.prefService.setColumns(selected);
  });
  rows = computed(() => {
    const list = this.paginationComponent()?.paginatedList().map((item) => createNestedObject<T>(item)) ?? [];
    return list;
  })
  //#endregion

  // =========================
  // #region FILTER IMPORT AND EXPORT
  // =========================

  prefService = inject(TablePreferencesService);

  onPreferencesChange = effect(() => {
    const prefs = this.prefService.preferences();
    if(!prefs) return;
    untracked(() => {
      this.selectedColumnFields.set(prefs.columns);
      this.setSort(prefs.sort, false);
    });
  });

  // #endregion

}

export type SelectRowsScope = 'filtered' | 'page' | 'all';