// table.component.ts
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
} from '@angular/core';
import {
  FilterFunction,
  SortDirection,
  SortEvent,
} from './models/table-models';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'nba-table',
  imports: [CommonModule, PaginationModule, FormsModule],
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      nba-table .pagination {
        margin: 0;
      }
      nba-table .pagination {
        --bs-pagination-border-radius: 0.25rem;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class TableComponent<T = any> implements OnInit {
  value = input.required<T[] | undefined | null>();

  // Signals para ordenação (públicos para acesso das diretivas)
  sortField = signal<string | null>(null);
  sortDirection = signal<SortDirection>(null);
  paginated = input(true, { transform: booleanAttribute });
  maxSize = input<number>(5);
  itemsPerPage = model<number>(10);
  page = model<number>(1);

  // ✅ Configuração para URL
  urlParam = input<string>('page'); // Nome do parâmetro na URL
  syncWithUrl = input(true, { transform: booleanAttribute }); // Se deve sincronizar com URL

  smallNumPages = signal<number>(0);
  filters = signal<Record<string, FilterFunction>>({});

  // ✅ Injetar dependências para roteamento
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  // Dados processados (filtrados e ordenados)
  processedData = computed(() => {
    let data = this.value() || [];

    // Aplicar ordenação
    if (this.sortField() && this.sortDirection()) {
      data = this.sortData(data, this.sortField()!, this.sortDirection()!);
    }

    const filters = this.filters();

    if (Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([field, value]) => {
        if (value && field.length > 0) {
          data = this.filterData(data, field, value);
        }
      });
    }

    return data;
  });

  paginatedData = computed(() => {
    if (!this.paginated()) return this.processedData();
    const startIndex = (this.page() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();
    return this.processedData().slice(startIndex, endIndex);
  });

  // ✅ Computed para total de páginas
  totalPages = computed(() => {
    const total = this.processedData().length;
    const perPage = this.itemsPerPage();
    return Math.ceil(total / perPage);
  });

  // Templates
  caption = contentChild<TemplateRef<any>>('caption');
  header = contentChild<TemplateRef<any>>('header');
  body = contentChild<TemplateRef<any>>('body');

  constructor() {
    effect(() => {
      // reagir quando itens por página ou total de itens mudar
      this.itemsPerPage();
      const max = Math.max(1, this.totalPages());
      if (this.page() > max) {
        this.page.set(1);
        this.updateUrl(1);
      }
    }, { allowSignalWrites: true });
  }

  // ✅ Inicialização para sincronizar com URL
  ngOnInit() {
    if (!this.syncWithUrl()) return;

    // Ler página inicial da URL
    this.initializePageFromUrl();

    // Escutar mudanças nos query params
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const urlPage = parseInt(params[this.urlParam()]) || 1;

        // Só atualiza se for diferente da página atual
        if (urlPage !== this.page()) {
          this.page.set(urlPage);
        }
      });
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

  private filterData(
    data: T[],
    field: string,
    filterFunc: FilterFunction
  ): T[] {
    return data.filter((entity) => {
      return filterFunc(this.getFieldValue(entity, field));
    });
  }

  setFilter(field: string, fn: FilterFunction) {
    this.filters.update(curr => ({ ...curr, [field]: fn }));
    this.goToPage(1);
  }

  clearFilter(field: string) {
    this.filters.update(({ [field]: _removed, ...rest }) => rest);
    this.goToPage(1);
  }

  private getFieldValue(obj: any, field: string): any {
    return field.split('.').reduce((o, f) => o?.[f], obj);
  }

  // ✅ Inicializar página da URL
  private initializePageFromUrl() {
    const currentParams = this.route.snapshot.queryParams;
    const urlPage = parseInt(currentParams[this.urlParam()]) || 1;

    // Validar se a página é válida
    const validPage = Math.max(1, urlPage);
    this.page.set(validPage);
  }

  // Método público para ordenação (usado pelas diretivas)
  onSort(event: SortEvent) {
    this.sortField.set(event.field);
    this.sortDirection.set(event.direction);

    // ✅ Resetar para página 1 quando ordenar
    this.goToPage(1);
  }

  // ✅ Método para ir para uma página específica
  goToPage(pageNumber: number) {
    const totalPages = this.totalPages();
    const validPage = Math.max(1, Math.min(pageNumber, totalPages));

    this.page.set(validPage);
    this.updateUrl(validPage);
  }

  // ✅ Event handler da paginação
  pageChanged(event: PageChangedEvent) {
    this.goToPage(event.page);
  }

  // ✅ Atualizar URL sem recarregar
  private updateUrl(pageNumber: number) {
    if (!this.syncWithUrl()) return;

    const currentParams = { ...this.route.snapshot.queryParams };

    if (pageNumber === 1) {
      // Remove o parâmetro se for página 1 (mais limpo)
      delete currentParams[this.urlParam()];
    } else {
      currentParams[this.urlParam()] = pageNumber.toString();
    }

    // Navegar sem recarregar a página
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: currentParams,
      queryParamsHandling: 'replace', // Substitui os query params
      replaceUrl: false, // Mantém no histórico
    });
  }

  onItemsPerPage(val: number | string) {
    const n = typeof val === 'string' ? parseInt(val, 10) : val;
    this.itemsPerPage.set(Number.isFinite(n) && n > 0 ? n : 10);
    afterNextRender(() => this.goToPage(1));
  }


}
