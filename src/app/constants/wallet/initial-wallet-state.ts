import { IWalletState } from '../../core';
import { DEFAULT_COIN } from '../coin-list';

export const initialWalletState: IWalletState = {
    loading: false,
    freeAmount: DEFAULT_COIN,
    assets: [],
    assetsValue: 0,
    favourites: [],
};
