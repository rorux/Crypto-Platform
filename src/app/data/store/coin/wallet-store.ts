import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { forkJoin, pipe, switchMap, tap } from 'rxjs';
import { initialWalletState } from '../../../constants';
import { IWalletParams } from '../../../core';
import { CoinApiService, ICoinApiResponse } from '../../api';
import { CoinListMapper } from '../../mappers';

export const WalletStore = signalStore(
    withState(initialWalletState),
    withMethods((store, coinApiService = inject(CoinApiService), coinListMapper = inject(CoinListMapper)) => {
        const loadWallet = rxMethod<IWalletParams>(
            pipe(
                tap(() => patchState(store, { loading: true })),
                switchMap((params: IWalletParams) => {
                    const priceConversationParams = {
                        amount: params.freeAmount,
                        id: params.currencyId,
                        convertId: params.baseCoin.id,
                    };
                    const assetsCoinsIds = params.coins.map((coin) => coin.id);
                    const assetsCoinsCountRegistry = params.coins.reduce<Record<string, number>>((acc, coin) => {
                        return { ...acc, [coin.id]: coin.count };
                    }, {});

                    return forkJoin([
                        coinApiService.getPriceConversion(priceConversationParams),
                        coinApiService.getCoinListByIds(assetsCoinsIds.join(','), params.baseCoin),
                        coinApiService.getCoinListByIds(params.favourites.list.join(','), params.baseCoin),
                    ]).pipe(
                        tapResponse({
                            next: ([priceConversionApiResponse, assetsCoinsApiResponse, favouritesApiResponse]) => {
                                const freeAmount = coinListMapper.fromCoinApiResponseToCoin(
                                    priceConversionApiResponse.data,
                                    {
                                        list: [],
                                    },
                                );
                                let assetsValue: number = freeAmount.price || 0;
                                const assets = Object.values(assetsCoinsApiResponse.data)
                                    .map((coin: ICoinApiResponse) =>
                                        coinListMapper.fromCoinApiResponseToCoin(coin, { list: [] }),
                                    )
                                    .map((coin) => {
                                        const count = assetsCoinsCountRegistry[coin.id];
                                        const totalPrice = count * (coin.price || 0);
                                        assetsValue += totalPrice;
                                        return { ...coin, count, totalPrice };
                                    });
                                const favourites = Object.values(favouritesApiResponse.data).map(
                                    (coin: ICoinApiResponse) =>
                                        coinListMapper.fromCoinApiResponseToCoin(coin, { list: [] }),
                                );

                                return patchState(store, {
                                    freeAmount,
                                    assets,
                                    assetsValue,
                                    favourites,
                                    loading: false,
                                });
                            },
                            error: () => patchState(store, initialWalletState),
                        }),
                    );
                }),
            ),
        );

        return { loadWallet };
    }),
);
