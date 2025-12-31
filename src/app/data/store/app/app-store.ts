import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { BASE_COIN_LOCAL_STORAGE_ITEM, initialAppState } from '../../../constants';
import { ICoin } from '../../../core';

export const AppStore = signalStore(
    withState(initialAppState),
    withMethods((store) => {
        const toggleMenuCollapse = () => {
            patchState(store, {
                isMenuCollapsed: !store.isMenuCollapsed(),
            });
        };

        const setBaseCoin = ({ id, name, symbol }: ICoin) => {
            localStorage.setItem(BASE_COIN_LOCAL_STORAGE_ITEM, JSON.stringify({ id, name, symbol }));
            patchState(store, { baseCoin: { id, name, symbol } });
        };

        return { toggleMenuCollapse, setBaseCoin };
    }),
);
