import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { initialAppState } from '../../../constants';

export const AppStore = signalStore(
    withState(initialAppState),
    withMethods((store) => ({
        toggleMenuCollapse() {
            patchState(store, {
                isMenuCollapsed: !store.isMenuCollapsed(),
            });
        },
    })),
);
