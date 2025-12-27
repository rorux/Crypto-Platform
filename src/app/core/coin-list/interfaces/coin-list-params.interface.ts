import { CoinListSortDirection, CoinListSortedKey } from '../types';
import { ICoin } from './coin.interface';

export interface ICoinListParams {
    baseCoin: ICoin;
    start: number;
    limit: number;
    sort: CoinListSortedKey;
    sortDirection: CoinListSortDirection;
}
