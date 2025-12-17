import { CurrencyListApiSortDirection, CurrencyListApiSortedKey } from '../types';

export interface ICurrencyListApiRequest {
    start: number;
    limit: number;
    sort: CurrencyListApiSortedKey;
    sortDirection: CurrencyListApiSortDirection;
}
