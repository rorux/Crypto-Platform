import { Injectable } from '@angular/core';
import { CoinListSortDirection, CoinListSortedKey, ICoin, ICoinListParams } from '../../core';
import { CoinListApiSortDirection, CoinListApiSortedKey, ICoinApiResponse, ICoinListApiRequest } from '../api';

@Injectable({ providedIn: 'root' })
export class CoinListMapper {
    public fromParamsToApiRequest(params: ICoinListParams): ICoinListApiRequest {
        return {
            start: params.start,
            limit: params.limit,
            sort: this.getApiRequestSortedKey(params.sort),
            sortDirection: this.getApiRequestSortDirection(params.sortDirection),
        };
    }

    public fromCoinApiResponseToCoin(coinApi: ICoinApiResponse): ICoin {
        const {
            id,
            name,
            symbol,
            circulating_supply,
            quote: {
                USD: { price, market_cap },
            },
        } = coinApi;

        return {
            id,
            name,
            symbol,
            price,
            circulatingSupply: circulating_supply,
            marketCap: market_cap,
        };
    }

    private getApiRequestSortedKey(key: CoinListSortedKey): CoinListApiSortedKey {
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

    private getApiRequestSortDirection(dir: CoinListSortDirection): CoinListApiSortDirection {
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
