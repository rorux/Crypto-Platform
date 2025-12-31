import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { AppStore, AssetsStore, WalletStore } from '../../../data';
import { IWalletParams } from '../../../core';
import { WALLET_LABELS } from '../../labels';
import { NumberFormatter } from '../../formatters';

@Component({
    selector: 'app-wallet',
    imports: [NzGridModule, NzTypographyModule, NzIconDirective, NzFlexDirective, NzSkeletonModule],
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
    protected readonly numberFormatter = inject(NumberFormatter);
    protected readonly walletLabels = WALLET_LABELS;

    constructor() {
        this.assetsStore.loadAssets();

        effect(() => {
            const freeAmount = this.assetsStore.freeAmount();
            const coins = this.assetsStore.coins();
            const baseCoin = this.appStore.baseCoin();

            if (freeAmount) {
                this.convertAssetsToBaseCoin({
                    currencyId: this.assetsStore.currencyId(),
                    baseCoin,
                    freeAmount,
                    coins,
                });
            }
        });
    }

    protected convertAssetsToBaseCoin(params: IWalletParams): void {
        this.walletStore.loadWallet(params);
    }
}
