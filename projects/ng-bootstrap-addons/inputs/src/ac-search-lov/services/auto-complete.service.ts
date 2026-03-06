import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { AutoCompleteConfig } from '../models/ac-models';

@Injectable()
export class AutocompleteService<T = any> {
  constructor(private http: HttpClient) {}

  private lastReq: LastRequest<T> | null = null;

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

  performAutocomplete(config: AutoCompleteConfig): Observable<T> {
    let { apiUrl, params } = this.buildApiCall(config);

    // 5. Adicionar o termo de busca (IMPORTANTE: reatribuir a variável params)
    if (config.desc && config.searchName) {
      params = params.append(config.searchName, config.desc);
    }

    // Gerar a URL completa para a chave do cache
    const fullUrl = params.keys().length > 0 ? `${apiUrl}?${params.toString()}` : apiUrl;

    // 6. Verificação de repetição
    if (this.lastReq && this.lastReq.url === fullUrl) {
      const diff = new Date().getTime() - this.lastReq.date.getTime();
      if (diff < 1000) {
        return this.lastReq.data;
      }
    }

    // 7. Nova requisição com shareReplay(1)
    const request$ = this.http.get<T>(apiUrl, { params }).pipe(
      shareReplay(1)
    );

    this.lastReq = {
      date: new Date(),
      url: fullUrl,
      data: request$
    };

    return request$;
  }
}

interface LastRequest<T> {
  date: Date;
  url: string;
  data: Observable<T>;
}