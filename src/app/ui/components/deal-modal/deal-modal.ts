import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number';
import { ICoin, IProfileAssetsCoin } from '../../../core';
import { DEAL_MODAL_WIDTH, MIN_AMOUNT, MIN_DEAL_AMOUNT } from '../../../constants';
import { WALLET_LABELS } from '../../labels';
import { NumberFormatter } from '../../formatters';

@Component({
    selector: 'app-deal-modal',
    imports: [NzTypographyModule, NzModalModule, NzButtonModule, NzFlexDirective, NzInputNumberComponent, FormsModule],
    templateUrl: './deal-modal.html',
    styleUrl: './deal-modal.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class DealModal {
    public coin = input<IProfileAssetsCoin>();
    public isVisible = input<boolean>(false);
    public baseCoin = input<ICoin>();
    public freeAmount = input<number>();
    public readonly close = output();
    protected readonly numberFormatter = inject(NumberFormatter);
    protected purchaseCount = signal<number>(MIN_DEAL_AMOUNT);
    protected purchaseAmount = signal<number>(0);
    protected isPurchaseButtonDisabled = signal<boolean>(false);
    protected saleCount = signal<number>(MIN_DEAL_AMOUNT);
    protected saleAmount = signal<number>(0);
    protected isSaleButtonDisabled = signal<boolean>(false);
    protected isShow: boolean = false;

    protected readonly modalWidth = DEAL_MODAL_WIDTH;
    protected readonly walletLabels = WALLET_LABELS;
    protected readonly minDealAmount = MIN_DEAL_AMOUNT;

    constructor() {
        effect(() => {
            this.isShow = this.isVisible();
        });

        effect(() => {
            const isSaleButtonDisabled = this.saleCount() > (this.coin()?.count || 0);
            this.saleAmount.set(this.saleCount() * (this.coin()?.price || 0));
            this.isSaleButtonDisabled.set(isSaleButtonDisabled);
        });

        effect(() => {
            const isPurchaseButtonDisabled =
                this.purchaseCount() * (this.coin()?.price || 0) > (this.freeAmount() || 0);
            this.purchaseAmount.set(this.purchaseCount() * (this.coin()?.price || 0));
            this.isPurchaseButtonDisabled.set(isPurchaseButtonDisabled);
        });
    }

    protected get title(): string {
        return `${this.walletLabels.deal} ${this.coin()?.name} (${this.coin()?.symbol})`;
    }

    protected get conversion(): string {
        const price = this.numberFormatter.formatPrice(this.coin()?.price || 0);

        return `${MIN_AMOUNT} ${this.coin()?.symbol} = ${price} ${this.baseCoin()?.symbol}`;
    }

    protected get availableCount(): string {
        return `${this.walletLabels.available}: ${this.coin()?.count}`;
    }

    protected get availableAmount(): string {
        const freeAmount = this.numberFormatter.formatLargeNumber(this.freeAmount() || 0);

        return `${this.walletLabels.freeAmount}: ${freeAmount} ${this.baseCoin()?.symbol}`;
    }

    protected get saleAmountWithCurrency(): string {
        return `${this.numberFormatter.formatPrice(this.saleAmount())} ${this.baseCoin()?.symbol}`;
    }

    protected get purchaseAmountWithCurrency(): string {
        return `${this.numberFormatter.formatPrice(this.purchaseAmount())} ${this.baseCoin()?.symbol}`;
    }

    protected onClose(): void {
        this.close.emit();
        this.clearSettings();
    }

    private clearSettings(): void {
        this.purchaseCount.set(MIN_DEAL_AMOUNT);
        this.purchaseAmount.set(0);
        this.isPurchaseButtonDisabled.set(false);
        this.saleCount.set(MIN_DEAL_AMOUNT);
        this.saleAmount.set(0);
        this.isSaleButtonDisabled.set(false);
    }
}
