import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'nba-pagination',
  imports: [FormsModule, CommonModule],
  styleUrl: './pagination.component.scss',
  templateUrl: './pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent<T=any> {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  list = input<T[]>([]);
  itemsPerPageOptions = input<number[]>([10, 25, 50]);

  paginatedList = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.list().slice(start, end);
  });

  itemsPerPage = signal(10);

  currentPage = signal(this.getInitialPage());

  pagination = computed(() => {
    const totalItems = this.list().length;
    const initialIndex = (this.currentPage() - 1) * this.itemsPerPage() + 1;
    const finalIndex = Math.min(this.currentPage() * this.itemsPerPage(), totalItems);
    return { totalItems, itemsPerPage: this.itemsPerPage(), currentPage: this.currentPage(), initialIndex, finalIndex };
  });

  width = computed(() => {
    const currentPage = this.currentPage();
    if(currentPage < 10) return '1.35rem';
    if(currentPage < 100) return '1.75rem';
    return '2rem';
  });

  totalPages = computed(() => Math.ceil(this.list().length / this.itemsPerPage()));

  hasPreviousPage = computed(() => this.currentPage() > 1);
  hasNextPage = computed(() => this.currentPage() < this.totalPages());

  constructor() {
    effect(() => {
      const page = this.currentPage();
      this.updateQueryString(page);
      this.itemsPerPage.set(this.itemsPerPageOptions()[0]);
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
      queryParams['p'] = page.toString();
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
