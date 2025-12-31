import { IAppState, ICoin } from '../../core';
import { DEFAULT_COIN } from '../coin-list';
import { BASE_COIN_LOCAL_STORAGE_ITEM } from './constants';

const baseCoinLocalStorageItem = localStorage.getItem(BASE_COIN_LOCAL_STORAGE_ITEM);

const baseCoin = baseCoinLocalStorageItem ? JSON.parse(baseCoinLocalStorageItem) : DEFAULT_COIN;

export const initialAppState: IAppState = {
    isMenuCollapsed: false,
    baseCoin,
};
