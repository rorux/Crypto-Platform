import { ICoinListState } from '../../core';

export const initialCoinListState: ICoinListState = {
    list: [],
    loading: false,
    total: 10,
    pageSize: 10,
    pageIndex: 1,
    sort: 'marketCap',
    sortDirection: 'descend',
};
