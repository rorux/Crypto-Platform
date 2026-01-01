import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap } from 'rxjs';
import { initialAssetsState } from '../../../constants';
import { IProfileAssetsCoin, IProfileAssetsDeal } from '../../../core';
import { ProfileApiService } from '../../api';

export const AssetsStore = signalStore(
    withState(initialAssetsState),
    withMethods((store, profileApiService = inject(ProfileApiService)) => {
        const loadAssets = rxMethod<void>(
            pipe(
                tap(() => patchState(store, { loading: true })),
                switchMap(() => {
                    return profileApiService.getAssets().pipe(
                        tapResponse({
                            next: (profileAssets) => {
                                return patchState(store, {
                                    ...profileAssets,
                                    loading: false,
                                });
                            },
                            error: () => patchState(store, initialAssetsState),
                        }),
                    );
                }),
            ),
        );

        const executeDeal = rxMethod<IProfileAssetsDeal>(
            pipe(
                tap(() => patchState(store, { loading: true })),
                switchMap((deal: IProfileAssetsDeal) => {
                    const type = deal.type;
                    let freeAmount = deal.freeAmount;
                    const currencyId = deal.baseCoin.id;
                    const storeCoins = store.coins() as IProfileAssetsCoin[];
                    const dealCoinId = deal.coin.id;
                    let coinsChanged = false;

                    const coins = storeCoins
                        .map(({ id, name, symbol, count }: IProfileAssetsCoin) => {
                            if (id === dealCoinId) {
                                if (type === 'purchase') {
                                    freeAmount -= deal.amount;
                                    coinsChanged = true;
                                    return { id, name, symbol, count: deal.coin.count + deal.count };
                                } else {
                                    freeAmount += deal.amount;
                                    return { id, name, symbol, count: deal.coin.count - deal.count };
                                }
                            } else return { id, name, symbol, count };
                        })
                        .filter((coin) => coin.count > 0);

                    if (!coinsChanged && type === 'purchase') {
                        freeAmount -= deal.amount;
                        coins.push({
                            id: deal.coin.id,
                            name: deal.coin.name,
                            symbol: deal.coin.symbol,
                            count: deal.count,
                        });
                    }

                    return profileApiService.putAssets({ freeAmount, currencyId, coins }).pipe(
                        tapResponse({
                            next: (profileAssets) => {
                                return patchState(store, {
                                    ...profileAssets,
                                    loading: false,
                                });
                            },
                            error: () => patchState(store, initialAssetsState),
                        }),
                    );
                }),
            ),
        );

        return { loadAssets, executeDeal };
    }),
);
