import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { of, pipe, switchMap, tap } from 'rxjs';
import { initialSearchCurrencyState } from '../../../constants';
import { ApiService } from '../../api';
import { CurrencyListMapper } from '../../mappers';

export const SearchCurrencyStore = signalStore(
    withState(initialSearchCurrencyState),
    withMethods((store, apiService = inject(ApiService), currencyListMapper = inject(CurrencyListMapper)) => {
        const clearState = () => {
            patchState(store, initialSearchCurrencyState);
        };

        const loadCurrency = rxMethod<string>(
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

                    return apiService.getSearchCurrency(symbol).pipe(
                        tapResponse({
                            next: (response) => {
                                const currencyApi = Object.values(response.data)[0];

                                const newStore = {
                                    symbol,
                                    list: currencyApi
                                        ? [currencyListMapper.fromCurrencyApiResponseToCurrency(currencyApi)]
                                        : [],
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

        return { clearState, loadCurrency };
    }),
);
