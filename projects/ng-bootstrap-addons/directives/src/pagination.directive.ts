import { computed, Directive, signal, inject, effect } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Directive({
  selector: '[appPagination]'
})
export class PaginationDirective<T=any> {

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  list = signal<T[]>([]);

  paginatedList = computed(() => {
    const start = (this.currentPage() - 1) * this.itemPerPage();
    const end = start + this.itemPerPage();
    return this.list().slice(start, end);
  });

  itemPerPage = signal(10);

  currentPage = signal(this.getInitialPage());

  pagination = computed(() => {
    const totalItems = this.list().length;
    const initialIndex = (this.currentPage() - 1) * this.itemPerPage() + 1;
    const finalIndex = Math.min(this.currentPage() * this.itemPerPage(), totalItems);
    return { totalItems, itemsPerPage: this.itemPerPage(), currentPage: this.currentPage(), initialIndex, finalIndex };
  });

  totalPages = computed(() => Math.ceil(this.list().length / this.itemPerPage()));

  hasPreviousPage = computed(() => this.currentPage() > 1);
  hasNextPage = computed(() => this.currentPage() < this.totalPages());

  constructor() {
    effect(() => {
      const page = this.currentPage();
      this.updateQueryString(page);
    });

    this.route.queryParams.subscribe(params => {
      const page = parseInt(params['p']) || 1;
      if (page !== this.currentPage()) {
        this.currentPage.set(page);
      }
    });
  }

  private getInitialPage(): number {
    const page = parseInt(this.route.snapshot.queryParams['p']) || 1;
    return page > 0 ? page : 1;
  }

  private updateQueryString(page: number) {
    const queryParams = { ...this.route.snapshot.queryParams };
    
    if (page === 1) {
      delete queryParams['p'];
    } else {
      queryParams['p'] = page?.toString();
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'replace',
      replaceUrl: true
    });
  }
  
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) {
      return;
    }
    this.currentPage.set(page);
  }

  nextPage() {
    this.goToPage(this.currentPage() + 1);
  }

  previousPage() {
    this.goToPage(this.currentPage() - 1);
  }

  firstPage() {
    this.goToPage(1);
  }

  lastPage() {
    this.goToPage(this.totalPages());
  }

}