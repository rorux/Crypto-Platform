import { CurrencyListSortDirection, CurrencyListSortedKey } from '../types';

export interface ICurrencyListParams {
    start: number;
    limit: number;
    sort: CurrencyListSortedKey;
    sortDirection: CurrencyListSortDirection;
}
