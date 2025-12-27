import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap } from 'rxjs';
import { initialProfileState } from '../../../constants';
import { ProfileApiService } from '../../profile-api';

export const ProfileStore = signalStore(
    withState(initialProfileState),
    withMethods((store, profileApiService = inject(ProfileApiService)) => {
        const loadFavourites = rxMethod<void>(
            pipe(
                tap(() => patchState(store, { loading: true })),
                switchMap(() => {
                    return profileApiService.getFavourites().pipe(
                        tapResponse({
                            next: (favourites) => {
                                return patchState(store, {
                                    favourites,
                                    loading: false,
                                });
                            },
                            error: () => patchState(store, initialProfileState),
                        }),
                    );
                }),
            ),
        );

        return { loadFavourites };
    }),
);
