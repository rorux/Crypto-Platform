import { ICoinListParams } from '../../core';
import { DEFAULT_COIN } from './constants';

export const defaultCoinListParams: ICoinListParams = {
    baseCoin: DEFAULT_COIN,
    start: 1,
    limit: 10,
    sort: 'marketCap',
    sortDirection: 'descend',
};
