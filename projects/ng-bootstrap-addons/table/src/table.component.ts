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
  OnInit,
  inject,
  DestroyRef,
  afterNextRender,
  effect,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { FilterFunction, GlobalFilterFunction, SortDirection, SortEvent } from './models/table-models';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DragScrollDirective } from 'ng-bootstrap-addons/directives';
import { PaginationComponent } from 'ng-bootstrap-addons/components';

@Component({
  selector: 'nba-table',
  imports: [CommonModule, FormsModule, DragScrollDirective, PaginationComponent],
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TableComponent<T = any> implements OnInit {
  value = input.required<T[] | undefined | null>();

  // =========================
  // #region ORDENAÇÃO
  // =========================
  sortField = signal<string | null>(null);
  sortDirection = signal<SortDirection>(null);

  onSort(event: SortEvent) {
    this.sortField.set(event.field);
    this.sortDirection.set(event.direction);
    this.goToPage(1);
    this._syncPageInputWithState();
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
  // #region PAGINAÇÃO
  // =========================
  paginated = input(true, { transform: booleanAttribute });
  itemsPerPage = model<number>(10);
  page = model<number>(1);

  // input do campo "Página"
  private _pageInput = signal<number>(1);
  pageInput = () => this._pageInput();

  isFirstPage = computed(() => this.page() <= 1);
  isLastPage  = computed(() => this.page() >= this.totalPages());

  // total de páginas calculado
  totalPages = computed(() => {
    const total = this.processedData().length;
    const perPage = +this.itemsPerPage() || 10;
    return Math.max(1, Math.ceil(total / perPage));
  });

  // info "Mostrando X–Y de N"
  pageInfo = computed(() => {
    const total = this.processedData().length;
    const per   = +this.itemsPerPage() || 10;
    const page  = Math.min(Math.max(1, +this.page() || 1), Math.max(1, Math.ceil(total / per)));
    const from  = total === 0 ? 0 : (page - 1) * per + 1;
    const to    = Math.min(page * per, total);
    return { from, to, total, per, page };
  });

  onPageInputChange(val: number | string) {
    const n = typeof val === 'string' ? parseInt(val, 10) : val;
    this._pageInput.set(Number.isFinite(n) ? (n as number) : this.page());
    this.applyPageInput()
  }

  applyPageInput() {
    let n = this._pageInput();
    if (!Number.isFinite(n as any)) n = this.page();
    this.goToPage(n);
    this._syncPageInputWithState();
  }

  firstPage() { this.goToPage(1); this._syncPageInputWithState(); }
  lastPage()  { this.goToPage(this.totalPages()); this._syncPageInputWithState(); }
  prevPage()  { this.goToPage(this.page() - 1); this._syncPageInputWithState(); }
  nextPage()  { this.goToPage(this.page() + 1); this._syncPageInputWithState(); }

  onItemsPerPage(val: number | string) {
    const n = typeof val === 'string' ? parseInt(val, 10) : val;
    this.itemsPerPage.set(Number.isFinite(n) && (n as number) > 0 ? (n as number) : 10);
    this._resetToFirstPageNextRender();
  }

  private _syncPageInputWithState() {
    this._pageInput.set(this.page());
  }

  // mantém a página válida quando muda itemsPerPage/total
  constructor() {
    effect(() => {
      this.itemsPerPage();
      const max = Math.max(1, this.totalPages());
      if (this.page() > max) {
        this.page.set(1);
        this.updateUrl(1);
        this._syncPageInputWithState();
      }
    });
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

  paginatedData = computed(() => {
    if (!this.paginated()) return this.processedData();
    const per   = +this.itemsPerPage() || 10;
    const page  = +this.page() || 1;
    const start = (page - 1) * per;
    const end   = start + per;
    return this.processedData().slice(start, end);
  });
  // #endregion

  // =========================
  // #region URL (query param)
  // =========================
  urlParam = input<string>('page');
  syncWithUrl = input(true, { transform: booleanAttribute });

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private injector = inject(Injector);

  ngOnInit() {
    if (!this.syncWithUrl()) return;

    this.initializePageFromUrl();

    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const urlPage = parseInt(params[this.urlParam()]) || 1;
        if (urlPage !== this.page()) {
          this.page.set(urlPage);
          this._syncPageInputWithState();
        }
      });
  }

  private initializePageFromUrl() {
    const currentParams = this.route.snapshot.queryParams;
    const urlPage = parseInt(currentParams[this.urlParam()]) || 1;
    const validPage = Math.max(1, urlPage);
    this.page.set(validPage);
    this._syncPageInputWithState();
  }

  goToPage(pageNumber: number) {
    const totalPages = this.totalPages();
    const validPage = Math.max(1, Math.min(pageNumber, totalPages));
    this.page.set(validPage);
    this.updateUrl(validPage);
  }

  private updateUrl(pageNumber: number) {
    if (!this.syncWithUrl()) return;
    const currentParams = { ...this.route.snapshot.queryParams };
    if (pageNumber === 1) delete currentParams[this.urlParam()];
    else currentParams[this.urlParam()] = String(pageNumber);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: currentParams,
      queryParamsHandling: 'replace',
      replaceUrl: false,
    });
  }

  private _resetToFirstPageNextRender() {
    runInInjectionContext(this.injector, () => {
      afterNextRender(() => {
        this.goToPage(1);
        this._syncPageInputWithState();
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
}