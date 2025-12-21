import { CoinListApiSortDirection, CoinListApiSortedKey } from '../types';

export interface ICoinListApiRequest {
    start: number;
    limit: number;
    sort: CoinListApiSortedKey;
    sortDirection: CoinListApiSortDirection;
}
