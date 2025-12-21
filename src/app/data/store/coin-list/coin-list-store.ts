import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CoinListSortDirection, CoinListSortedKey, ICoinListParams } from '../../../core';
import { defaultCoinListParams, initialCoinListState } from '../../../constants';
import { ApiService } from '../../api';
import { CoinListMapper } from '../../mappers';

export const CoinListStore = signalStore(
    withState(initialCoinListState),
    withMethods((store, apiService = inject(ApiService), coinListMapper = inject(CoinListMapper)) => {
        const loadCoinList = rxMethod<ICoinListParams | void>(
            pipe(
                tap(() => patchState(store, { loading: true })),
                switchMap((data) => {
                    const params = data || defaultCoinListParams;

                    return apiService.getCoinList(coinListMapper.fromParamsToApiRequest(params)).pipe(
                        tapResponse({
                            next: (response) => {
                                return patchState(store, {
                                    list: response.data.map(coinListMapper.fromCoinApiResponseToCoin),
                                    loading: false,
                                    total: response.status.total_count,
                                    pageSize: params.limit,
                                    pageIndex: (params.start - 1) / params.limit + 1,
                                    sort: params.sort,
                                    sortDirection: params.sortDirection,
                                });
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

        const changeQueryParams = (params: NzTableQueryParams): void => {
            const prevSort = store.sort();
            const prevSortDirection = store.sortDirection();
            let sort: CoinListSortedKey | null = null;
            let sortDirection: CoinListSortDirection | null = null;

            for (let i = 0; i < params.sort.length; i++) {
                if (params.sort[i].value) {
                    sort = params.sort[i].key;
                    sortDirection = params.sort[i].value as CoinListSortDirection;
                    break;
                }

                if (i === params.sort.length - 1) {
                    sort = initialCoinListState.sort;
                    sortDirection = initialCoinListState.sortDirection;
                }
            }

            const coinListParams: ICoinListParams = {
                start: (params.pageIndex - 1) * params.pageSize + 1,
                limit: params.pageSize,
                sort: sort || prevSort,
                sortDirection: sortDirection || prevSortDirection,
            };

            loadCoinList(coinListParams);
        };

        return { loadCoinList, changeQueryParams };
    }),
);
