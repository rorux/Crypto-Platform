import { ICoinListParams } from '../../core';

export const defaultCoinListParams: ICoinListParams = {
    start: 1,
    limit: 10,
    sort: 'marketCap',
    sortDirection: 'descend',
};
