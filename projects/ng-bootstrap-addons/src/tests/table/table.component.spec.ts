// table.component.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component, TemplateRef, ViewChild, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { TableComponent } from 'table/table.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SortDirection, SortEvent, FilterFunction } from 'table/models/table-models';

// Mock data para testes
interface MockUser {
  id: number;
  name: string;
  email: string;
  age: number;
  status: 'active' | 'inactive';
}

const mockUsers: MockUser[] = [
  { id: 1, name: 'João Silva', email: 'joao@email.com', age: 30, status: 'active' },
  { id: 2, name: 'Maria Santos', email: 'maria@email.com', age: 25, status: 'inactive' },
  { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', age: 35, status: 'active' },
  { id: 4, name: 'Ana Lima', email: 'ana@email.com', age: 28, status: 'active' },
  { id: 5, name: 'Carlos Oliveira', email: 'carlos@email.com', age: 42, status: 'inactive' }
];

@Component({
  standalone: true,
  imports: [TableComponent, CommonModule, FormsModule],
  template: `
    <nba-table 
      [value]="users()"
      [paginated]="paginated"
      [itemsPerPage]="itemsPerPage()"
      [(page)]="page"
      [multiple]="multiple"
      [syncWithUrl]="syncWithUrl"
      [globalFilterFields]="globalFilterFields"
      [globalFilter]="globalFilter()"
      [globalFilterFunction]="globalFilterFunction"
      [urlParam]="urlParam">
      
      <ng-template #caption>
        <caption>Lista de Usuários</caption>
      </ng-template>
      
      <ng-template #header>
        <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Idade</th>
            <th>Status</th>
        </tr>
      </ng-template>
      
      <ng-template #body let-users>
        @for(user of users; track $index){
            <tr>
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.age }}</td>
                <td>{{ user.status }}</td>
            </tr>
        }
      </ng-template>
    </nba-table>
  `
})
class HostComponent {
  users = signal<MockUser[]>(mockUsers);
  paginated = true;
  itemsPerPage = signal(3);
  page = signal(1);
  multiple = false;
  syncWithUrl = true;
  globalFilterFields = ['name', 'email'];
  globalFilter = signal<string>('');
  globalFilterFunction: any = null;
  urlParam = 'page';

  @ViewChild(TableComponent) table!: TableComponent<MockUser>;
}

describe('TableComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let component: TableComponent<MockUser>;
  let router: jasmine.SpyObj<Router>;
  let route: jasmine.SpyObj<ActivatedRoute>;
  let queryParamsSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    queryParamsSubject = new BehaviorSubject({});
    
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const routeSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      queryParams: queryParamsSubject.asObservable(),
      snapshot: { queryParams: {} }
    });

    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;

    fixture.detectChanges();
    component = host.table;
  });

  describe('Criação do Componente', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.sortField()).toBeNull();
      expect(component.sortDirection()).toBeNull();
      expect(component.page()).toBe(1);
      expect(component.itemsPerPage()).toBe(3);
      expect(component.selectedRows()).toEqual([]);
    });

    it('should display all users when no pagination', () => {
      host.paginated = false;
      fixture.detectChanges();
      
      expect(component.paginatedData().length).toBe(5);
    });
  });

  describe('Paginação', () => {
    it('should paginate data correctly', () => {
      expect(component.paginatedData().length).toBe(3);
      expect(component.totalPages()).toBe(2);
    });

    it('should go to next page', () => {
      component.nextPage();
      expect(component.page()).toBe(2);
      expect(component.pageInput()).toBe(2);
    });

    it('should go to previous page', () => {
      component.goToPage(2);
      component.prevPage();
      expect(component.page()).toBe(1);
    });

    it('should go to first page', () => {
      component.goToPage(2);
      component.firstPage();
      expect(component.page()).toBe(1);
    });

    it('should go to last page', () => {
      component.lastPage();
      expect(component.page()).toBe(2);
    });

    it('should update page info correctly', () => {
      const pageInfo = component.pageInfo();
      expect(pageInfo.from).toBe(1);
      expect(pageInfo.to).toBe(3);
      expect(pageInfo.total).toBe(5);
      expect(pageInfo.per).toBe(3);
      expect(pageInfo.page).toBe(1);
    });

    it('should handle page input change', () => {
      component.onPageInputChange('2');
      component.applyPageInput();
      expect(component.page()).toBe(2);
    });

    it('should handle invalid page input', () => {
      component.onPageInputChange('invalid');
      component.applyPageInput();
      expect(component.page()).toBe(1); // Should keep current page
    });

    it('should change items per page', () => {
      component.onItemsPerPage(2);
      expect(component.itemsPerPage()).toBe(2);
      expect(component.totalPages()).toBe(3);
    });

    it('should reset to first page when changing items per page', () => {
      component.goToPage(2);
      component.onItemsPerPage(10);
      fixture.detectChanges();
      expect(component.page()).toBe(1);
    });

    it('should check if is first page', () => {
      expect(component.isFirstPage()).toBe(true);
      component.nextPage();
      expect(component.isFirstPage()).toBe(false);
    });

    it('should check if is last page', () => {
      expect(component.isLastPage()).toBe(false);
      component.lastPage();
      expect(component.isLastPage()).toBe(true);
    });
  });

  describe('Ordenação', () => {
    it('should sort data by field ascending', () => {
      const sortEvent: SortEvent = { field: 'name', direction: 'asc' };
      component.setSort(sortEvent);
      
      expect(component.sortField()).toBe('name');
      expect(component.sortDirection()).toBe('asc');
      
      const sortedData = component.processedData();
      expect(sortedData[0].name).toBe('Ana Lima');
      expect(sortedData[4].name).toBe('Pedro Costa');
    });

    it('should sort data by field descending', () => {
      const sortEvent: SortEvent = { field: 'age', direction: 'desc' };
      component.setSort(sortEvent);
      
      const sortedData = component.processedData();
      expect(sortedData[0].age).toBe(42);
      expect(sortedData[4].age).toBe(25);
    });

    it('should sort nested field', fakeAsync(() => {
      const dataWithNested:MockUser[] = [
        { name: 'Charlie', id: 1, email: 'charlie@example.com', age: 29, status: 'active'},
        { name: 'Alice', id: 2, email: 'alice@example.com', age: 34, status: 'inactive' },
        { name: 'Bob', id: 3, email: 'bob@example.com', age: 42, status: 'active' }
      ];
      
      host.users.set(dataWithNested);
      fixture.detectChanges();
      tick();

      const sortEvent: SortEvent = { field: 'name', direction: 'asc' };
      component.setSort(sortEvent);
      
      const sortedData = component.processedData();
      expect(sortedData[0].name).toBe('Alice');
    }));

    it('should reset to first page when sorting', () => {
      component.goToPage(2);
      const sortEvent: SortEvent = { field: 'name', direction: 'asc' };
      component.setSort(sortEvent);
      
      expect(component.page()).toBe(1);
    });
  });

  describe('Filtros', () => {
    it('should filter data by field', fakeAsync(() => {
      const filterFn: FilterFunction = (value) => value === 'active';
      component.setFilter('status', filterFn);
      tick();
      
      const filteredData = component.processedData();
      expect(filteredData.length).toBe(3);
      expect(filteredData.every(user => user.status === 'active')).toBe(true);
    }));

    it('should clear specific filter', fakeAsync(() => {
      const filterFn: FilterFunction = (value) => value === 'active';
      component.setFilter('status', filterFn);
      tick();
      
      expect(component.processedData().length).toBe(3);
      
      component.clearFilter('status');
      tick();
      
      expect(component.processedData().length).toBe(5);
    }));

    it('should clear all filters', fakeAsync(() => {
      const filterFn: FilterFunction = (value) => value === 'active';
      component.setFilter('status', filterFn);
      component.setSort({ field: 'name', direction: 'asc' });
      component.globalFilter.set('João');
      
      component.clearFilters();
      tick();
      
      expect(component.filters()).toEqual({});
      expect(component.sortField()).toBeNull();
      expect(component.sortDirection()).toBeNull();
      expect(component.globalFilter()).toBeNull();
    }));

    it('should apply multiple filters', fakeAsync(() => {
      const statusFilter: FilterFunction = (value) => value === 'active';
      const ageFilter: FilterFunction = (value) => value >= 30;
      
      component.setFilter('status', statusFilter);
      component.setFilter('age', ageFilter);
      tick();
      
      const filteredData = component.processedData();
      expect(filteredData.length).toBe(2); // João (30) e Pedro (35)
      expect(filteredData.every(user => user.status === 'active' && user.age >= 30)).toBe(true);
    }));
  });

  describe('Filtro Global', () => {
    it('should filter globally by default function', () => {
      component.globalFilter.set('joão');
      
      const filteredData = component.globalFilterData(mockUsers);
      expect(filteredData.length).toBe(1);
      expect(filteredData[0].name).toBe('João Silva');
    });

    it('should filter globally by multiple fields', () => {
      component.globalFilter.set('email.com');
      
      const filteredData = component.globalFilterData(mockUsers);
      expect(filteredData.length).toBe(5); // All have .com emails
    });

    it('should use custom global filter function', () => {
      host.globalFilterFunction = (value: any, term: string) => {
        return String(value).toLowerCase().startsWith(term.toLowerCase());
      };
      fixture.detectChanges();
      
      component.globalFilter.set('jo');
      
      const filteredData = component.globalFilterData(mockUsers);
      expect(filteredData.length).toBe(1);
      expect(filteredData[0].name).toBe('João Silva');
    });

    it('should handle global filter debounce', fakeAsync(() => {
      spyOn(component, 'globalFilterData').and.callThrough();
      
      component.onGlobalFilterChange('test1');
      component.onGlobalFilterChange('test2');
      component.onGlobalFilterChange('test3');
      
      // Shouldn't filter yet
      expect(component.globalFilter()).toBe('');
      
      tick(component.globalFilterDebounceMs());
      
      // Should filter with last value
      expect(component.globalFilter()).toBe('test3');
    }));

    it('should reset to first page when global filtering', fakeAsync(() => {
      component.goToPage(2);
      component.onGlobalFilterChange('joão');
      tick(component.globalFilterDebounceMs());
      fixture.detectChanges();
      
      expect(component.page()).toBe(1);
    }));
  });

  describe('Seleção de Linhas', () => {
    it('should select single row', () => {
      component.selectRow(mockUsers[0]);
      expect(component.selectedRows()).toEqual([mockUsers[0]]);
    });

    it('should deselect row when already selected', () => {
      component.selectRow(mockUsers[0]);
      component.selectRow(mockUsers[0]);
      expect(component.selectedRows()).toEqual([]);
    });

    it('should select multiple rows when multiple is enabled', () => {
      host.multiple = true;
      fixture.detectChanges();
      
      component.selectRow(mockUsers[0]);
      component.selectRow(mockUsers[1]);
      
      expect(component.selectedRows().length).toBe(2);
      expect(component.selectedRows()).toContain(mockUsers[0]);
      expect(component.selectedRows()).toContain(mockUsers[1]);
    });

    it('should replace selection when multiple is disabled', () => {
      host.multiple = false;
      fixture.detectChanges();
      
      component.selectRow(mockUsers[0]);
      component.selectRow(mockUsers[1]);
      
      expect(component.selectedRows()).toEqual([mockUsers[1]]);
    });

    it('should select all rows', () => {
      component.selectAllRows();
      expect(component.selectedRows().length).toBe(5);
      expect(component.areAllRowsSelected()).toBe(true);
    });

    it('should unselect all rows', () => {
      component.selectAllRows();
      component.unselectAllRows();
      expect(component.selectedRows()).toEqual([]);
      expect(component.areAllRowsSelected()).toBe(false);
    });

    it('should toggle select all rows', () => {
      // Initially no rows selected
      expect(component.areAllRowsSelected()).toBe(false);
      
      component.toggleSelectAllRows();
      expect(component.areAllRowsSelected()).toBe(true);
      
      component.toggleSelectAllRows();
      expect(component.areAllRowsSelected()).toBe(false);
    });
  });

  describe('Sincronização com URL', () => {
    it('should update URL when page changes', () => {
      component.goToPage(2);
      
      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: { page: '2' },
        queryParamsHandling: 'replace',
        replaceUrl: false
      });
    });

    it('should remove page param when going to page 1', () => {
      component.goToPage(1);
      
      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: {},
        queryParamsHandling: 'replace',
        replaceUrl: false
      });
    });

    it('should sync page from URL params', () => {
      queryParamsSubject.next({ page: '3' });
      
      expect(component.page()).toBe(3);
      expect(component.pageInput()).toBe(3);
    });

    it('should use custom URL parameter', () => {
      host.urlParam = 'currentPage';
      fixture.detectChanges();
      
      component.goToPage(2);
      
      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: { currentPage: '2' },
        queryParamsHandling: 'replace',
        replaceUrl: false
      });
    });

    it('should not sync with URL when disabled', () => {
      host.syncWithUrl = false;
      fixture.detectChanges();
      
      router.navigate.calls.reset();
      component.goToPage(2);
      
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Processamento de Dados', () => {
    it('should process data with sort, filter and pagination', fakeAsync(() => {
      // Apply sorting
      component.setSort({ field: 'age', direction: 'desc' });
      
      // Apply filter
      const filterFn: FilterFunction = (value) => value === 'active';
      component.setFilter('status', filterFn);
      tick();
      
      // Apply global filter
      component.globalFilter.set('silva');
      
      const processedData = component.processedData();
      expect(processedData.length).toBe(1);
      expect(processedData[0].name).toBe('João Silva');
    }));

    it('should handle empty data', () => {
      host.users.set([]);
      fixture.detectChanges();
      
      expect(component.processedData()).toEqual([]);
      expect(component.paginatedData()).toEqual([]);
      expect(component.totalPages()).toBe(1);
    });

    it('should handle null/undefined data', () => {
      host.users.set(null as any);
      fixture.detectChanges();
      
      expect(component.processedData()).toEqual([]);
      expect(component.paginatedData()).toEqual([]);
    });
  });

  describe('Utilitários', () => {
    it('should format numbers correctly', () => {
      expect(component.formatNumber(1000)).toBe('1.000');
      expect(component.formatNumber(1234567)).toBe('1.234.567');
    });

    it('should get nested field values', () => {
      const obj = { user: { profile: { name: 'Test' } } };
      const getValue = (component as any).getFieldValue.bind(component);
      
      expect(getValue(obj, 'user.profile.name')).toBe('Test');
      expect(getValue(obj, 'user.profile.nonexistent')).toBeUndefined();
    });
  });

  describe('Templates Projetados', () => {
    it('should project caption template', () => {
      const captionElement = fixture.debugElement.query(By.css('caption'));
      expect(captionElement.nativeElement.textContent.trim()).toBe('Lista de Usuários');
    });

    it('should project header template', () => {
      const headerElements = fixture.debugElement.queryAll(By.css('th'));
      expect(headerElements.length).toBeGreaterThan(0);
      expect(headerElements[0].nativeElement.textContent.trim()).toBe('ID');
    });

    it('should project body template for each row', () => {
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(rows.length).toBe(3); // First page with 3 items
    });
  });

  describe('Edge Cases', () => {
    it('should handle page greater than total pages', () => {
      component.goToPage(999);
      expect(component.page()).toBe(component.totalPages());
    });

    it('should handle page less than 1', () => {
      component.goToPage(-1);
      expect(component.page()).toBe(1);
    });

    it('should handle items per page change that affects current page', fakeAsync(() => {
        host.page.set(2);
        host.itemsPerPage.set(10);
        tick();
      
        expect(component.page()).toBe(1);
    }));

    it('should handle sort with null/undefined values', () => {
      const dataWithNulls = [
        { id: 1, name: null, age: 30 },
        { id: 2, name: 'John', age: null },
        { id: 3, name: 'Jane', age: 25 }
      ];
      
      host.users.set(dataWithNulls as any);
      fixture.detectChanges();
      
      component.setSort({ field: 'name', direction: 'asc' });
      
      // Should not throw error
      expect(component.processedData().length).toBe(3);
    });
  });
});