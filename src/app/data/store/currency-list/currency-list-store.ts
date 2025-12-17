import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap } from 'rxjs';
import { ApiService } from '../../api';
import { defaultCurrencyListParams, initialCurrencyListState } from '../../../constants';
import { ICurrencyListParams } from '../../../core';
import { CurrencyListMapper } from '../../mappers';

export const CurrencyListStore = signalStore(
    withState(initialCurrencyListState),
    withMethods((store, apiService = inject(ApiService), currencyListMapper = inject(CurrencyListMapper)) => ({
        loadCurrencyList: rxMethod<ICurrencyListParams | void>(
            pipe(
                tap(() => patchState(store, { loading: true })),
                switchMap((data) => {
                    const params = (data || defaultCurrencyListParams) as ICurrencyListParams;

                    return apiService.getCurrencyList(currencyListMapper.fromParamsToApiRequest(params)).pipe(
                        tapResponse({
                            next: (response) => {
                                return patchState(store, {
                                    list: response.data.map(currencyListMapper.fromCurrencyApiResponseToCurrency),
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
        ),
    })),
);
