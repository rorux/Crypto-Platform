import { IProfileAssetsState } from '../../core';
import { DEFAULT_COIN_ID } from '../coin-list';

export const initialAssetsState: IProfileAssetsState = {
    loading: false,
    freeAmount: 0,
    currencyId: DEFAULT_COIN_ID,
    coins: [],
};
