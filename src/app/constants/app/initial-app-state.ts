import { IAppState } from '../../core';
import { DEFAULT_COIN } from '../coin-list';

export const initialAppState: IAppState = {
    isMenuCollapsed: false,
    baseCoin: DEFAULT_COIN,
};
