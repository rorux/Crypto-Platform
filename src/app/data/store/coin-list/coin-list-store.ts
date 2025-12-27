import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap } from 'rxjs';
import { ICoinListParams } from '../../../core';
import { initialCoinListState } from '../../../constants';
import { CoinApiService, ICoinApiResponse } from '../../coin-api';
import { CoinListMapper } from '../../mappers';

export const CoinListStore = signalStore(
    withState(initialCoinListState),
    withMethods((store, coinApiService = inject(CoinApiService), coinListMapper = inject(CoinListMapper)) => {
        const loadCoinList = rxMethod<ICoinListParams>(
            pipe(
                tap(() => patchState(store, { loading: true })),
                switchMap((params: ICoinListParams) => {
                    return coinApiService.getCoinList(coinListMapper.fromParamsToApiRequest(params)).pipe(
                        tapResponse({
                            next: (response) => {
                                return patchState(store, {
                                    list: response.data.map((coinApi: ICoinApiResponse) => {
                                        return coinListMapper.fromCoinApiResponseToCoin(coinApi, params.favourites);
                                    }),
                                    loading: false,
                                    total: response.status.total_count,
                                    pageSize: params.limit,
                                    pageIndex: (params.start - 1) / params.limit + 1,
                                    sort: params.sort,
                                    sortDirection: params.sortDirection,
                                });
                            },
                            error: () => patchState(store, initialCoinListState),
                        }),
                    );
                }),
            ),
        );

        return { loadCoinList };
    }),
);
