import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap } from 'rxjs';
import { initialFavouritesState } from '../../../constants';
import { ProfileApiService } from '../../api';

export const FavouritesStore = signalStore(
    withState(initialFavouritesState),
    withMethods((store, profileApiService = inject(ProfileApiService)) => {
        const loadFavourites = rxMethod<void>(
            pipe(
                tap(() => patchState(store, { loading: true })),
                switchMap(() => {
                    return profileApiService.getFavourites().pipe(
                        tapResponse({
                            next: (profileFavourites) => {
                                return patchState(store, {
                                    ...profileFavourites,
                                    loading: false,
                                });
                            },
                            error: () => patchState(store, initialFavouritesState),
                        }),
                    );
                }),
            ),
        );

        const addFavourite = rxMethod<number>(
            pipe(
                tap(() => patchState(store, { loading: true })),
                switchMap((coinId: number) => {
                    const list = Array.from(new Set([...store.list(), coinId]));

                    return profileApiService.putFavourites({ list }).pipe(
                        tapResponse({
                            next: (profileFavourites) => {
                                return patchState(store, {
                                    ...profileFavourites,
                                    loading: false,
                                });
                            },
                            error: () => patchState(store, initialFavouritesState),
                        }),
                    );
                }),
            ),
        );

        const removeFavourite = rxMethod<number>(
            pipe(
                tap(() => patchState(store, { loading: true })),
                switchMap((coinId: number) => {
                    const list = store.list().filter((id) => id !== coinId);

                    return profileApiService.putFavourites({ list }).pipe(
                        tapResponse({
                            next: (profileFavourites) => {
                                return patchState(store, {
                                    ...profileFavourites,
                                    loading: false,
                                });
                            },
                            error: () => patchState(store, initialFavouritesState),
                        }),
                    );
                }),
            ),
        );

        return { loadFavourites, addFavourite, removeFavourite };
    }),
);
