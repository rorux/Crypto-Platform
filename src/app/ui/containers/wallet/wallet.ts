import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AppStore, AssetsStore, FavouritesStore, WalletStore } from '../../../data';
import { ICoin, IProfileAssetsCoin, IProfileAssetsDeal, IWalletAsset, IWalletParams } from '../../../core';
import { APPROVAL_MODAL_TOP, DEFAULT_COIN } from '../../../constants';
import { WALLET_LABELS } from '../../labels';
import { NumberFormatter } from '../../formatters';
import { AssetsTable, DealModal } from '../../components';
import { CoinSelect } from '../coin-select';

@Component({
    selector: 'app-wallet',
    imports: [
        NzGridModule,
        NzTypographyModule,
        NzButtonModule,
        NzIconDirective,
        NzFlexDirective,
        NzSkeletonModule,
        NzDividerModule,
        NzCardModule,
        AssetsTable,
        CoinSelect,
        DealModal,
    ],
    templateUrl: './wallet.html',
    styleUrl: './wallet.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [AssetsStore, WalletStore],
})
export class Wallet {
    protected readonly appStore = inject(AppStore);
    protected readonly assetsStore = inject(AssetsStore);
    protected readonly walletStore = inject(WalletStore);
    protected readonly favouritesStore = inject(FavouritesStore);
    protected readonly numberFormatter = inject(NumberFormatter);
    protected readonly walletLabels = WALLET_LABELS;
    protected loading = signal<boolean>(false);
    protected isDealModalVisible = signal<boolean>(false);
    protected assetsCoinForDeal = signal<IProfileAssetsCoin>({ ...DEFAULT_COIN, count: 0 });
    private assetsCoinsCountRegistry = signal<Record<string, number>>({});

    constructor(private approval: NzModalService) {
        this.assetsStore.loadAssets();

        effect(() => {
            const freeAmount = this.assetsStore.freeAmount();
            const coins = this.assetsStore.coins();
            const baseCoin = this.appStore.baseCoin();

            this.assetsCoinsCountRegistry.set(
                coins.reduce<Record<string, number>>((acc, coin) => {
                    return { ...acc, [coin.id]: coin.count };
                }, {}),
            );

            if (freeAmount) {
                this.convertAssetsToBaseCoin({
                    currencyId: this.assetsStore.currencyId(),
                    baseCoin,
                    freeAmount,
                    coins,
                    favourites: { list: this.favouritesStore.list() },
                });
            }
        });

        effect(() => {
            this.loading.set(this.assetsStore.loading() || this.walletStore.loading());
        });
    }

    protected convertAssetsToBaseCoin(params: IWalletParams): void {
        this.walletStore.loadWallet(params);
    }

    protected getTitleWithCurrency(title: string): string {
        return `${title} ${this.appStore.baseCoin()?.symbol || ''}`;
    }

    protected onClickAsset(coin: IWalletAsset): void {
        this.assetsCoinForDeal.set(coin);
        this.showDealModal();
    }

    protected onClickFavourite(coin: ICoin): void {
        this.assetsCoinForDeal.set({ ...coin, count: this.assetsCoinsCountRegistry()[coin.id] || 0 });
        this.showDealModal();
    }

    protected onSearchCoin(coin: ICoin): void {
        this.assetsCoinForDeal.set({ ...coin, count: this.assetsCoinsCountRegistry()[coin.id] || 0 });
        this.showDealModal();
    }

    protected onHideDealModal(): void {
        this.isDealModalVisible.set(false);
    }

    protected onTradeExecuted(deal: IProfileAssetsDeal): void {
        this.assetsStore.executeDeal(deal);
        this.onHideDealModal();
    }

    protected onRemoveCoinFromFavourites(coin: ICoin): void {
        const favourite = `${coin.name} (${coin.symbol})`;

        this.approval.confirm({
            nzTitle: `<i>${this.walletLabels.removeFavouriteConfirm} ${favourite}?</i>`,
            nzStyle: { top: APPROVAL_MODAL_TOP },
            nzOnOk: () => {
                this.favouritesStore.removeFavourite(coin.id);
            },
        });
    }

    private showDealModal(): void {
        this.isDealModalVisible.set(true);
    }
}
