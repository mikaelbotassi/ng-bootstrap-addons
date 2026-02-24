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
  viewChildren,
  effect,
  contentChildren,
} from '@angular/core';
import { Column, FilterFunction, GlobalFilterFunction, SortDirection, SortEvent } from './models/table-models';
import { FormsModule } from '@angular/forms';
import { DragScrollDirective } from 'ng-bootstrap-addons/directives';
import { PaginationComponent } from 'ng-bootstrap-addons/pagination';
import { createNestedObject } from 'ng-bootstrap-addons/utils';
import { MultiselectOption } from 'ng-bootstrap-addons/selects';
import { ColumnMultiselectComponent } from './components/column-multiselect/column-multiselect.component';
import { ColumnHeaderComponent } from './public_api';
import TableService from './services/table.service';

@Component({
  selector: 'nba-table',
  imports: [CommonModule, FormsModule, DragScrollDirective, PaginationComponent, ColumnMultiselectComponent],
  providers: [TableService],
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TableComponent<T extends Object = any> {
  value = input.required<T[] | undefined | null>();

  // =========================
  // #region ORDENAÇÃO
  // =========================
  sortField = signal<string | null>(null);
  sortDirection = signal<SortDirection>(null);

  onSort(event: SortEvent) {
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

  clearFilters() {
    this.filters.set({});
    this.sortField.set(null);
    this.sortDirection.set(null);
    this.globalFilter.set(null);
    this._resetToFirstPageNextRender();
  }

  private filterData(data: T[], field: string, filterFunc: FilterFunction): T[] {
    return data.filter(entity => filterFunc(this.getFieldValue(entity, field)));
  }
  // #endregion
  // =========================
  // #region DADOS (processamento)
  // =========================
  processedData = computed(() => {
    let data = this.value() ?? [];
    
    // ordenação
    if (this.sortField() && this.sortDirection()) {
      data = this.sortData(data, this.sortField()!, this.sortDirection()!);
    }

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
  multiple = input(false, { transform: booleanAttribute });
  selectedRows = model<T[]>([]);
  selectRow(row: T) {
    const index = this.selectedRows().indexOf(row);
    if(index > -1){
      this.selectedRows.update((current) => {
        return current.filter((r) => r !== row);
      });
      return;
    }
    if (!this.multiple()) {
      this.selectedRows.set([row]);
      return;
    }
    this.selectedRows.update((current) => [...current, row]);
  }
  deselectRow(row: T) {
    this.selectedRows.update((current) => {
      return current.filter((r) => r !== row);
    });
  }
  unselectAllRows = () => this.selectedRows.set([]);
  selectAllRows = () => this.selectedRows.set(this.value() ?? []);
  toggleSelectAllRows = () => {
    if (this.areAllRowsSelected()) {
      this.unselectAllRows();
    } else {
      this.selectAllRows();
    }
  };
  areAllRowsSelected = computed(() => {
    if (!this.value()) return false;
    return this.selectedRows().length === this.value()?.length;
  });
  // #endregion

  // =========================
  // #region UTIL
  // =========================
  private getFieldValue(obj: any, field: string): any {
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
  header  = contentChild<TemplateRef<any>>('header');
  body    = contentChild<TemplateRef<any>>('body');
  // #endregion

  // =========================
  // #region TOGGLE COLUMNS
  // =========================
  columns = model<Column[]|null|undefined>(null);
  columnsOptions = computed(() => this.columns()?.map((item) => new MultiselectOption({
    value: item.field,
    label: item.header
  })) ?? []);
  selectedColumnFields = model<string[]>([]);
  selectedColumns = computed(() => {
    const selected = this.selectedColumnFields();
    return untracked(() => this.columns()?.filter((col) => selected.findIndex((field) => field === col.field) >= 0) ?? []);
  });
  visibleColumns = computed(() => {
    const columns = this.columns();
    const selected = this.selectedColumnFields();
    return columns?.filter((col) => selected.findIndex((field) => field === col.field) >= 0) ?? [];
  });
  rows = computed(() => {
    const list = this.paginationComponent()?.paginatedList().map((item) => createNestedObject<T>(item)) ?? [];
    return list;
  })
  //#endregion

  // =========================
  // #region FILTER IMPORT AND EXPORT
  // =========================

  tableService = inject(TableService);

  // #endregion

}