import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IBaseApiResponse } from './interfaces';
import { CoinListApi, ICoinApiResponse, ICoinListApiRequest } from './coin-list';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;
    private readonly apiKey = environment.apiKey;

    public getCoinList(params: ICoinListApiRequest): Observable<CoinListApi> {
        return this.http.get<CoinListApi>(`${this.apiUrl}/v1/cryptocurrency/listings/latest`, {
            params: {
                aux: 'circulating_supply',
                start: params.start,
                limit: params.limit,
                sort: params.sort,
                sort_dir: params.sortDirection,
            },
            headers: this.headers,
        });
    }

    public getSearchCoinList(symbol: string): Observable<IBaseApiResponse<Record<string, ICoinApiResponse>>> {
        return this.http.get<IBaseApiResponse<Record<string, ICoinApiResponse>>>(
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
