import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { of, pipe, switchMap, tap } from 'rxjs';
import { initialConverterState } from '../../../constants';
import { CoinApiService, IConverterApiRequest } from '../../api';
import { CoinListMapper } from '../../mappers';

export const ConverterStore = signalStore(
    withState(initialConverterState),
    withMethods((store, coinApiService = inject(CoinApiService), coinListMapper = inject(CoinListMapper)) => {
        const loadPriceConversion = rxMethod<IConverterApiRequest>(
            pipe(
                tap(() => patchState(store, { loading: true })),
                switchMap((params: IConverterApiRequest) => {
                    if (params.convertId === 0) {
                        return of(null);
                    }

                    return coinApiService.getPriceConversion(params).pipe(
                        tapResponse({
                            next: (response) => {
                                return patchState(store, {
                                    coin: coinListMapper.fromCoinApiResponseToCoin(response.data, { list: [] }),
                                    loading: false,
                                    amount: params.amount,
                                    id: params.id,
                                    convertId: params.convertId,
                                });
                            },
                            error: () => patchState(store, initialConverterState),
                        }),
                    );
                }),
            ),
        );

        return { loadPriceConversion };
    }),
);
