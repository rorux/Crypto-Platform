import { ICurrencyListState } from '../../core';

export const initialCurrencyListState: ICurrencyListState = {
    list: [],
    loading: false,
    total: 10,
    pageSize: 10,
    pageIndex: 1,
    sort: 'marketCap',
    sortDirection: 'descend',
};
