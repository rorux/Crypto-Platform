import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IBaseApiResponse } from './interfaces';
import {
    CoinApi,
    CoinListApi,
    CoinShortListApi,
    ICoinApiResponse,
    ICoinListApiRequest,
    ICoinListSearchApiRequest,
} from './coin-list';
import { IConverterApiRequest } from './converter';
import { ICoin } from '../../core';

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
                convert_id: params.baseCoin.id,
            },
            headers: this.headers,
        });
    }

    public getCoinShortList(symbol: string): Observable<CoinShortListApi> {
        return this.http.get<CoinShortListApi>(`${this.apiUrl}/v1/cryptocurrency/map`, {
            params: {
                sort: 'id',
                symbol,
            },
            headers: this.headers,
        });
    }

    public getCoinListByIds(
        ids: string,
        baseCoin: ICoin,
    ): Observable<IBaseApiResponse<Record<string, ICoinApiResponse>>> {
        return this.http.get<IBaseApiResponse<Record<string, ICoinApiResponse>>>(
            `${this.apiUrl}/v1/cryptocurrency/quotes/latest`,
            {
                params: {
                    id: ids,
                    convert_id: baseCoin.id,
                },
                headers: this.headers,
            },
        );
    }

    public getPriceConversion(params: IConverterApiRequest): Observable<CoinApi> {
        return this.http.get<CoinApi>(`${this.apiUrl}/v2/tools/price-conversion`, {
            params: {
                amount: params.amount,
                id: params.id,
                convert_id: params.convertId,
            },
            headers: this.headers,
        });
    }

    private get headers(): Record<string, string> {
        return {
            'Access-Control-Allow-Origin': '*',
            'X-CMC_PRO_API_KEY': this.apiKey,
        };
    }
}
