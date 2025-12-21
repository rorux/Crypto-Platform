import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { of, pipe, switchMap, tap } from 'rxjs';
import { initialSearchCoinState } from '../../../constants';
import { ApiService } from '../../api';
import { CoinListMapper } from '../../mappers';

export const SearchCoinStore = signalStore(
    withState(initialSearchCoinState),
    withMethods((store, apiService = inject(ApiService), coinListMapper = inject(CoinListMapper)) => {
        const clearState = () => {
            patchState(store, initialSearchCoinState);
        };

        const loadCoinList = rxMethod<string>(
            pipe(
                switchMap((symbol: string) => {
                    const trimmedSymbol = symbol?.trim() || '';

                    if (!trimmedSymbol) {
                        clearState();
                        return of(null);
                    }

                    patchState(store, {
                        loading: true,
                        symbol: trimmedSymbol,
                    });

                    return apiService.getSearchCoinList(symbol).pipe(
                        tapResponse({
                            next: (response) => {
                                const coinApi = Object.values(response.data)[0];

                                const newStore = {
                                    symbol,
                                    list: coinApi ? [coinListMapper.fromCoinApiResponseToCoin(coinApi)] : [],
                                    loading: false,
                                };

                                return patchState(store, newStore);
                            },
                            error: () =>
                                patchState(store, {
                                    loading: false,
                                }),
                        }),
                    );
                }),
            ),
        );

        return { clearState, loadCoinList };
    }),
);
