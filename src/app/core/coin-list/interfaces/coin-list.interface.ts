import { ICoin } from './coin.interface';
import { CoinListSortDirection, CoinListSortedKey } from '../types';

export interface ICoinList {
    list: ICoin[];
    loading: boolean;
    total: number;
    pageSize: number;
    pageIndex: number;
    sort: CoinListSortedKey;
    sortDirection: CoinListSortDirection;
}
