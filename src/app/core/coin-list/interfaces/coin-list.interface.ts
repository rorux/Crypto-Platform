import { CoinListSortDirection, CoinListSortedKey } from '../types';
import { ICoin } from './coin.interface';

export interface ICoinList {
    list: ICoin[];
    loading: boolean;
    total: number;
    pageSize: number;
    pageIndex: number;
    sort: CoinListSortedKey;
    sortDirection: CoinListSortDirection;
}
