import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { AutocompleteService } from 'inputs/ac-search-lov/services/auto-complete.service';
import { AutoCompleteConfig } from 'inputs/ac-search-lov/models/ac-models';

const map = { code: { key: 'id', title: 'ID' }, desc: { key: 'desc', title: 'Description' } };

describe('AutocompleteService', () => {
  let service: AutocompleteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AutocompleteService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    
    service = TestBed.inject(AutocompleteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform autocomplete request without search property', () => {
    const mockResponse = [
      { id: 1, desc: 'Item 1' },
      { id: 2, desc: 'Item 2' }
    ];
    
    const config: AutoCompleteConfig = {
      url: '/api/test',
      map: map,
      type: 'autocomplete'
    };

    service.performAutocomplete(config).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/test');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys().length).toBe(0);
    req.flush(mockResponse);
  });

  it('should perform autocomplete request with search property', () => {
    const mockResponse = [
      { id: 1, desc: 'Test Item' }
    ];
    
    const config: AutoCompleteConfig = {
      url: '/api/search',
      type: 'lov',
      desc: 'test',
      searchName: 's',
      map: map
    };

    service.performAutocomplete(config).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/search?s=test');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('s')).toBe('test');
    req.flush(mockResponse);
  });

  it('should perform autocomplete request with existing params', () => {
    const mockResponse = [
      { id: 5, desc: 'Filtered Item' }
    ];
    
    const config: AutoCompleteConfig = {
      url: '/api/products?category=electronics&limit=10',
      map: map,
      desc: 'laptop',
      searchName: 's',
      type: 'autocomplete'
    };

    service.performAutocomplete(config).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/products?category=electronics&limit=10&s=laptop');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('category')).toBe('electronics');
    expect(req.request.params.get('limit')).toBe('10');
    expect(req.request.params.get('s')).toBe('laptop');
    req.flush(mockResponse);
  });

  it('should perform autocomplete request with numeric search property', () => {
    const mockResponse = [
      { id: 123, desc: 'Product 123' }
    ];
    
    const config: AutoCompleteConfig = {
      url: '/api/products',
      desc: (123).toString(),
      map: map,
      searchName: 's',
      type: 'autocomplete'
    };

    service.performAutocomplete(config).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/products?s=123');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('s')).toBe('123');
    req.flush(mockResponse);
  });

  it('should handle empty response', () => {
    const mockResponse: any[] = [];
    
    const config: AutoCompleteConfig = {
      url: '/api/empty',
      map: map,
      searchName: 's',
      desc: 'notfound',
      type: 'lov'
    };

    service.performAutocomplete(config).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBe(0);
    });

    const req = httpMock.expectOne('/api/empty?s=notfound');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle HTTP errors', () => {
    const config: AutoCompleteConfig = {
      url: '/api/error',
      map: map,
      type: 'autocomplete'
    };

    service.performAutocomplete(config).subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }
    });

    const req = httpMock.expectOne('/api/error');
    expect(req.request.method).toBe('GET');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

  it('should preserve existing params when adding search property', () => {
    
    const config: AutoCompleteConfig = {
      url: '/api/items?page=1&size=20&sort=name',
      desc: 'search term',
      map: map,
      searchName: 's',
      type: 'lov'
    };

    service.performAutocomplete(config).subscribe();

    const req = httpMock.expectOne('/api/items?page=1&size=20&sort=name&s=search%20term');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('size')).toBe('20');
    expect(req.request.params.get('sort')).toBe('name');
    expect(req.request.params.get('s')).toBe('search term');
    req.flush([]);
  });
});
