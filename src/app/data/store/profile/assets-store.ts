import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap } from 'rxjs';
import { initialAssetsState } from '../../../constants';
import { IProfileAssets } from '../../../core';
import { ProfileApiService } from '../../api';

export const AssetsStore = signalStore(
    withState(initialAssetsState),
    withMethods((store, profileApiService = inject(ProfileApiService)) => {
        const loadAssets = rxMethod<void>(
            pipe(
                tap(() => patchState(store, { loading: true })),
                switchMap(() => {
                    return profileApiService.getAssets().pipe(
                        tapResponse({
                            next: (profileAssets) => {
                                return patchState(store, {
                                    ...profileAssets,
                                    loading: false,
                                });
                            },
                            error: () => patchState(store, initialAssetsState),
                        }),
                    );
                }),
            ),
        );

        const setAssets = rxMethod<IProfileAssets>(
            pipe(
                tap(() => patchState(store, { loading: true })),
                switchMap((profileAssets: IProfileAssets) => {
                    return profileApiService.putAssets(profileAssets).pipe(
                        tapResponse({
                            next: (profileAssets) => {
                                return patchState(store, {
                                    ...profileAssets,
                                    loading: false,
                                });
                            },
                            error: () => patchState(store, initialAssetsState),
                        }),
                    );
                }),
            ),
        );

        return { loadAssets, setAssets };
    }),
);
