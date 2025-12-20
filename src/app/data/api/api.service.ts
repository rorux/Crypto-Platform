import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IBaseApiResponse, ISearchApiResponse } from './interfaces';
import { ICurrencyApiResponse, ICurrencyListApiRequest } from './currency-list';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;
    private readonly apiKey = environment.apiKey;

    public getCurrencyList(params: ICurrencyListApiRequest): Observable<IBaseApiResponse<ICurrencyApiResponse>> {
        return this.http.get<IBaseApiResponse<ICurrencyApiResponse>>(
            `${this.apiUrl}/v1/cryptocurrency/listings/latest`,
            {
                params: {
                    aux: 'circulating_supply',
                    start: params.start,
                    limit: params.limit,
                    sort: params.sort,
                    sort_dir: params.sortDirection,
                },
                headers: this.headers,
            },
        );
    }

    public getSearchCurrency(symbol: string): Observable<ISearchApiResponse<ICurrencyApiResponse>> {
        return this.http.get<ISearchApiResponse<ICurrencyApiResponse>>(
            `${this.apiUrl}/v1/cryptocurrency/quotes/latest`,
            {
                params: { symbol },
                headers: this.headers,
            },
        );
    }

    private get headers(): Record<string, string> {
        return {
            'Access-Control-Allow-Origin': '*',
            'X-CMC_PRO_API_KEY': this.apiKey,
        };
    }
}
