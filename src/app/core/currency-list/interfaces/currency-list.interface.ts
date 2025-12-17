import { ICurrency } from './currency.interface';
import { CurrencyListSortDirection, CurrencyListSortedKey } from '../types';

export interface ICurrencyList {
    list: ICurrency[];
    loading: boolean;
    total: number;
    pageSize: number;
    pageIndex: number;
    sort: CurrencyListSortedKey;
    sortDirection: CurrencyListSortDirection;
}
