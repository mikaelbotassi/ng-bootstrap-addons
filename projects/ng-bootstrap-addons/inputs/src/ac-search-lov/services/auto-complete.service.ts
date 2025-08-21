import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class AutocompleteService {

    constructor(private http: HttpClient) {}

    getCleanUrl(url:string){
      const cleanUrl = url.replace(/\/+$/, '');
      return cleanUrl;
    }
  
    performAutocomplete<T = any>(config: AutoCompleteConfig): Observable<T> {
      let { apiUrl, params } = config;
      return this.http.get<T>(`${apiUrl}`, {params: params});
    }
}

export interface AutoCompleteConfig {
    apiUrl: string;
    params?: HttpParams;
    type: 'autocomplete' | 'lov';
}