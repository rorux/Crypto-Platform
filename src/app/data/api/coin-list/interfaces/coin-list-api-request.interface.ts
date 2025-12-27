import { ICoin } from '../../../../core';
import { CoinListApiSortDirection, CoinListApiSortedKey } from '../types';

export interface ICoinListApiRequest {
    baseCoin: ICoin;
    start: number;
    limit: number;
    sort: CoinListApiSortedKey;
    sortDirection: CoinListApiSortDirection;
}
