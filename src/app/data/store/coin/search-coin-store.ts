import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { of, pipe, switchMap } from 'rxjs';
import { initialSearchCoinState } from '../../../constants';
import { ICoin } from '../../../core';
import {
    CoinApiService,
    CoinShortListApi,
    IBaseApiResponse,
    ICoinApiResponse,
    ICoinListSearchApiRequest,
} from '../../api';
import { CoinListMapper } from '../../mappers';

export const SearchCoinStore = signalStore(
    withState(initialSearchCoinState),
    withMethods((store, apiService = inject(CoinApiService), coinListMapper = inject(CoinListMapper)) => {
        const clearState = () => {
            patchState(store, initialSearchCoinState);
        };

        const setInitialCoin = (coin: ICoin) => {
            patchState(store, { ...initialSearchCoinState, list: [coin] });
        };

        const getCoinFromListById = (id: number): ICoin | undefined => {
            const list = store.list() as ICoin[];
            return list.find((coin) => coin.id === id);
        };

        const loadCoinList = rxMethod<ICoinListSearchApiRequest>(
            pipe(
                switchMap((params: ICoinListSearchApiRequest) => {
                    const trimmedSymbol = params.symbol?.trim() || '';

                    if (!trimmedSymbol) {
                        clearState();
                        return of(null);
                    }

                    patchState(store, {
                        loading: true,
                        symbol: trimmedSymbol,
                    });

                    return apiService.getCoinShortList(trimmedSymbol).pipe(
                        switchMap((shortListResponse: CoinShortListApi) => {
                            const ids = shortListResponse.data.map((item) => item.id);

                            if (ids.length === 0) {
                                return of({
                                    data: {},
                                } as IBaseApiResponse<Record<string, ICoinApiResponse>>);
                            }

                            return apiService.getCoinListByIds(ids.join(','), params.baseCoin);
                        }),

                        tapResponse({
                            next: (response: IBaseApiResponse<Record<string, ICoinApiResponse>>) => {
                                const coins = Object.values(response.data);

                                const newState = {
                                    symbol: trimmedSymbol,
                                    list: coins.map((coin) =>
                                        coinListMapper.fromCoinApiResponseToCoin(coin, params.favourites),
                                    ),
                                    loading: false,
                                };

                                patchState(store, newState);
                            },
                            error: (error) => {
                                patchState(store, {
                                    loading: false,
                                    list: [],
                                    symbol: trimmedSymbol,
                                });
                            },
                        }),
                    );
                }),
            ),
        );

        return { clearState, setInitialCoin, getCoinFromListById, loadCoinList };
    }),
);
