import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AutoCompleteConfig } from '../models/ac-models';

@Injectable()
export class AutocompleteService {
  constructor(private http: HttpClient) {}

  private buildApiCall(data: AutoCompleteConfig): {
    apiUrl: string;
    params: HttpParams;
  } {
    const codeKey = data.map.code.key;
    let url = data.url;
    let params = new HttpParams();

    const hasCode = !!data.code && data.code.toString().length;

    if (hasCode) url = url.replace(`:${codeKey}`, data.code!.toString());

    const [baseUrl, queryString] = url.split('?');

    if (queryString) {
      const searchParams = new URLSearchParams(queryString);
      searchParams.forEach((value, key) => {
        if (value === `:${codeKey}` && hasCode) {
          params = params.append(key, data.code!.toString());
          return;
        }
        if (value !== `:${codeKey}`) params = params.append(key, value);
      });
    }

    if (hasCode && !data.url.includes(`:${codeKey}`)) {
      params = params.append(codeKey, data.code!.toString());
    }

    return { apiUrl: baseUrl, params };
  }

  performAutocomplete<T = any>(config: AutoCompleteConfig): Observable<T> {
    let { apiUrl, params } = this.buildApiCall(config);
    if (config.desc && config.searchName) params = params.append(config.searchName, config.desc);
    return this.http.get<T>(`${apiUrl}`, { params: params });
  }
}