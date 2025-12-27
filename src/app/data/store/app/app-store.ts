import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { initialAppState } from '../../../constants';
import { ICoin } from '../../../core';

export const AppStore = signalStore(
    withState(initialAppState),
    withMethods((store) => {
        const toggleMenuCollapse = () => {
            patchState(store, {
                isMenuCollapsed: !store.isMenuCollapsed(),
            });
        };

        const setBaseCoin = (baseCoin: ICoin) => {
            patchState(store, { baseCoin });
        };

        return { toggleMenuCollapse, setBaseCoin };
    }),
);
