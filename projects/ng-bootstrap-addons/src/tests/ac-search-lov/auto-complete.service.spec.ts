import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { AutocompleteService, AutoCompleteConfig } from 'ng-bootstrap-addons/inputs';

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
      apiUrl: '/api/test',
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
      apiUrl: '/api/search',
      searchProperty: 'test',
      type: 'lov'
    };

    service.performAutocomplete(config).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/search?filtro=test');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('filtro')).toBe('test');
    req.flush(mockResponse);
  });

  it('should perform autocomplete request with existing params', () => {
    const mockResponse = [
      { id: 5, desc: 'Filtered Item' }
    ];
    
    const existingParams = new HttpParams()
      .set('category', 'electronics')
      .set('limit', '10');
    
    const config: AutoCompleteConfig = {
      apiUrl: '/api/products',
      searchProperty: 'laptop',
      params: existingParams,
      type: 'autocomplete'
    };

    service.performAutocomplete(config).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/products?category=electronics&limit=10&filtro=laptop');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('category')).toBe('electronics');
    expect(req.request.params.get('limit')).toBe('10');
    expect(req.request.params.get('filtro')).toBe('laptop');
    req.flush(mockResponse);
  });

  it('should perform autocomplete request with numeric search property', () => {
    const mockResponse = [
      { id: 123, desc: 'Product 123' }
    ];
    
    const config: AutoCompleteConfig = {
      apiUrl: '/api/products',
      searchProperty: 123,
      type: 'autocomplete'
    };

    service.performAutocomplete(config).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/products?filtro=123');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('filtro')).toBe('123');
    req.flush(mockResponse);
  });

  it('should handle empty response', () => {
    const mockResponse: any[] = [];
    
    const config: AutoCompleteConfig = {
      apiUrl: '/api/empty',
      searchProperty: 'notfound',
      type: 'lov'
    };

    service.performAutocomplete(config).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBe(0);
    });

    const req = httpMock.expectOne('/api/empty?filtro=notfound');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle HTTP errors', () => {
    const config: AutoCompleteConfig = {
      apiUrl: '/api/error',
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
    const existingParams = new HttpParams()
      .set('page', '1')
      .set('size', '20')
      .set('sort', 'name');
    
    const config: AutoCompleteConfig = {
      apiUrl: '/api/items',
      searchProperty: 'search term',
      params: existingParams,
      type: 'lov'
    };

    service.performAutocomplete(config).subscribe();

    const req = httpMock.expectOne('/api/items?page=1&size=20&sort=name&filtro=search%20term');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('size')).toBe('20');
    expect(req.request.params.get('sort')).toBe('name');
    expect(req.request.params.get('filtro')).toBe('search term');
    req.flush([]);
  });
});
