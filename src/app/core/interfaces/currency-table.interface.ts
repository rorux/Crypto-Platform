import { ICurrency } from './currency.interface';

export interface ICurrencyTable {
    list: ICurrency[];
    loading: boolean;
    total: number;
    pageSize: number;
    pageIndex: number;
}
