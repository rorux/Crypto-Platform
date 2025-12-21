import { CoinListSortDirection, CoinListSortedKey } from '../types';

export interface ICoinListParams {
    start: number;
    limit: number;
    sort: CoinListSortedKey;
    sortDirection: CoinListSortDirection;
}
