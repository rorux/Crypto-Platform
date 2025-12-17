import { Injectable } from '@angular/core';
import { CurrencyListSortDirection, CurrencyListSortedKey, ICurrency, ICurrencyListParams } from '../../core';
import {
    CurrencyListApiSortDirection,
    CurrencyListApiSortedKey,
    ICurrencyApiResponse,
    ICurrencyListApiRequest,
} from '../api';

@Injectable({ providedIn: 'root' })
export class CurrencyListMapper {
    public fromParamsToApiRequest(params: ICurrencyListParams): ICurrencyListApiRequest {
        return {
            start: params.start,
            limit: params.limit,
            sort: this.getApiRequestSortedKey(params.sort),
            sortDirection: this.getApiRequestSortDirection(params.sortDirection),
        };
    }

    public fromCurrencyApiResponseToCurrency(currencyApi: ICurrencyApiResponse): ICurrency {
        const {
            id,
            name,
            symbol,
            circulating_supply,
            quote: {
                USD: { price, market_cap },
            },
        } = currencyApi;

        return {
            id,
            name,
            symbol,
            price,
            circulatingSupply: circulating_supply,
            marketCap: market_cap,
        };
    }

    private getApiRequestSortedKey(key: CurrencyListSortedKey): CurrencyListApiSortedKey {
        switch (key) {
            case 'name': {
                return 'name';
            }
            case 'symbol': {
                return 'symbol';
            }
            case 'price': {
                return 'price';
            }
            case 'circulatingSupply': {
                return 'circulating_supply';
            }
            case 'marketCap': {
                return 'market_cap';
            }
            default: {
                return 'name';
            }
        }
    }

    private getApiRequestSortDirection(dir: CurrencyListSortDirection): CurrencyListApiSortDirection {
        switch (dir) {
            case 'ascend': {
                return 'asc';
            }
            case 'descend': {
                return 'desc';
            }
            default: {
                return 'asc';
            }
        }
    }
}
