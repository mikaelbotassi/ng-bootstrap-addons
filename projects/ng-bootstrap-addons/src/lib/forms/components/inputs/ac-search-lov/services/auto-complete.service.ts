import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn:'root'
})
export class AutocompleteService {

    constructor(private http: HttpClient) {}
  
    performAutocomplete<T = any>(config: AutoCompleteConfig): Observable<T> {
      let { apiUrl, searchProperty, params } = config;
      if (!params) params = new HttpParams();
      if (searchProperty) {
        params = params.append('filtro', searchProperty.toString());
      }
      return this.http.get<T>(`${apiUrl}`, {params: params});
    }
}

export interface AutoCompleteConfig {
    apiUrl: string;
    searchProperty?: string|number;
    params?: HttpParams;
    type: 'autocomplete' | 'lov';
}