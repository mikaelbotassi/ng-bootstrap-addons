import { computed, Directive, inject, effect, input, model, booleanAttribute } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';

@Directive({
  selector: '[nbaPagination]'
})
export class PaginationDirective<T=any> {

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  list = input<T[]>([]);
  perPageOptions = model<number[]>([10, 25, 50]);
  itemsPerPage = model<number>(10);
  formatOptions = effect(() => {
    const options = this.perPageOptions();
    const itemsPerPage = Number(this.itemsPerPage());
    
    if (!options.includes(itemsPerPage)) {
      options.push(itemsPerPage);
      options.sort((a, b) => a - b);
    }
  });
  formattedOptions = computed(() => {
    const originalOptions = this.perPageOptions();
    const itemsPerPage = Number(this.itemsPerPage());
    
    const options = [...originalOptions];
    
    if (!options.includes(itemsPerPage)) {
      options.push(itemsPerPage);
      options.sort((a, b) => a - b);
    }
    return options;
  });

  paginatedList = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.list().slice(start, end);
  });

  changeUrl = input(true, { transform: booleanAttribute});

  queryParamName = input('p');

  currentPage = model(this.getInitialPage());

  pagination = computed(() => {
    const totalItems = this.list().length;
    const initialIndex = (this.currentPage() - 1) * this.itemsPerPage() + 1;
    const finalIndex = Math.min(this.currentPage() * this.itemsPerPage(), totalItems);
    return { totalItems, itemsPerPage: this.itemsPerPage(), currentPage: this.currentPage(), initialIndex, finalIndex };
  });

  totalPages = computed(() => Math.ceil(this.list().length / this.itemsPerPage()));

  hasPreviousPage = computed(() => this.currentPage() > 1);
  hasNextPage = computed(() => this.currentPage() < this.totalPages());

  constructor() {
    effect(() => {
      const page = this.currentPage();
      this.updateQueryString(page);
    });

    this.route.queryParams
    .pipe(
      filter(() => this.changeUrl())
    )
    .subscribe(params => {
      const page = parseInt(params[this.queryParamName()]) || 1;
      if (page !== this.currentPage()) {
        this.currentPage.set(page);
      }
    });
  }

  private getInitialPage(): number {
    const page = parseInt(this.route.snapshot.queryParams[this.queryParamName()]) || 1;
    return page > 0 ? page : 1;
  }

  private updateQueryString(page: number) {
    if(!this.changeUrl()) return;
    const queryParams = { ...this.route.snapshot.queryParams };
    
    if (page === 1) {
      delete queryParams[this.queryParamName()];
    } else {
      queryParams[this.queryParamName()] = page?.toString();
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

  formatNumber(n: number) {
    return new Intl.NumberFormat('pt-BR').format(n);
  }

  onItemsPerPage(value: number) {
    this.itemsPerPage.set(value);
    this.currentPage.set(1);
  }

}