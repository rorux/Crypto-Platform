import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { ICoin } from '../../../core';
import { AppStore, ConverterStore } from '../../../data';
import { MIN_AMOUNT } from '../../../constants';
import { CONVERTER_LABELS } from '../../labels';
import { NumberFormatter } from '../../formatters';
import { CoinSelect } from '../coin-select';

@Component({
    selector: 'app-converter',
    imports: [
        CoinSelect,
        NzIconDirective,
        NzButtonComponent,
        NzCardModule,
        NzTooltipModule,
        NzTypographyModule,
        NzInputNumberModule,
        FormsModule,
        NzSpinComponent,
    ],
    templateUrl: './converter.html',
    styleUrl: './converter.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [ConverterStore],
})
export class Converter {
    protected readonly appStore = inject(AppStore);
    protected readonly converterStore = inject(ConverterStore);
    protected readonly numberFormatter = inject(NumberFormatter);
    protected readonly converterLabels = CONVERTER_LABELS;
    protected readonly minAmount = MIN_AMOUNT;
    protected leftCoin = signal<ICoin | null>(null);
    protected rightCoin = signal<ICoin | null>(null);
    protected loadingLeftCoin = signal<boolean>(false);
    protected loadingRightCoin = signal<boolean>(false);
    protected amount = signal<number>(MIN_AMOUNT);

    protected get isTransposeButtonDisabled(): boolean {
        return this.leftCoin() === null || this.rightCoin() === null;
    }

    protected get conversation(): string {
        const coin = this.converterStore.coin();

        if (!coin) {
            return '';
        }

        const left = `${this.amount()} ${this.leftCoin()?.symbol}`;
        const right = `${this.numberFormatter.formatPrice(this.converterStore.coin()?.price || 0)} ${this.rightCoin()?.symbol}`;

        return `${left} = ${right}`;
    }

    protected getCoinDescription(coin: ICoin | null): string {
        if (coin) {
            const left = `${MIN_AMOUNT} ${coin.symbol}`;
            const right = `${this.numberFormatter.formatPrice(coin.price || 0)} ${this.appStore.baseCoin().symbol}`;

            return `${left} = ${right}`;
        }

        return this.converterLabels.selectCoin;
    }

    protected onSelectLeftCoin(coin: ICoin): void {
        this.leftCoin.set(coin);
        this.amount.set(MIN_AMOUNT);

        if (this.rightCoin()) {
            this.loadPriceConversion();
        }
    }

    protected onLoadingLeftCoin(loading: boolean): void {
        if (this.leftCoin()) {
            this.loadingLeftCoin.set(loading);
        }
    }

    protected onLoadingRightCoin(loading: boolean): void {
        if (this.rightCoin()) {
            this.loadingRightCoin.set(loading);
        }
    }

    protected onSelectRightCoin(coin: ICoin): void {
        this.rightCoin.set(coin);

        if (this.leftCoin()) {
            this.loadPriceConversion();
        }
    }

    protected onTransposeCoins(): void {
        const prevLeftCoin = this.leftCoin();
        const prevRightCoin = this.rightCoin();

        this.leftCoin.set(prevRightCoin);
        this.rightCoin.set(prevLeftCoin);
        this.amount.set(MIN_AMOUNT);

        this.loadPriceConversion();
    }

    protected onAmountChange(): void {
        this.loadPriceConversion();
    }

    private loadPriceConversion(): void {
        this.converterStore.loadPriceConversion({
            amount: this.amount(),
            id: this.leftCoin()?.id || 0,
            convertId: this.rightCoin()?.id || 0,
        });
    }
}
