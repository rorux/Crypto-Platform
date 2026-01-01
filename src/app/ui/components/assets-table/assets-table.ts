import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ICoin, IWalletAsset } from '../../../core';
import { COIN_LABELS, TABLE_LABELS } from '../../labels';
import { NumberFormatter } from '../../formatters';

@Component({
    selector: 'app-assets-table',
    imports: [NzTableModule, FormsModule],
    templateUrl: './assets-table.html',
    styleUrl: './assets-table.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class AssetsTable {
    public assets = input<IWalletAsset[]>([]);
    public baseCoin = input<ICoin>();
    public loading = input<boolean>();
    public clickedCoin = output<IWalletAsset>();
    protected readonly numberFormatter = inject(NumberFormatter);
    protected readonly coinLabels = COIN_LABELS;
    protected readonly tableLabels = TABLE_LABELS;

    protected pageIndex = signal(1);
    protected pageSize = signal(10);
    protected totalItems = computed(() => this.assets().length);

    protected onPageIndexChange(pageIndex: number): void {
        this.pageIndex.set(pageIndex);
    }

    protected onPageSizeChange(pageSize: number): void {
        this.pageSize.set(pageSize);
        this.pageIndex.set(1);
    }

    protected getTitleWithCurrency(title: string): string {
        return `${title}, ${this.baseCoin()?.symbol || ''}`;
    }

    protected onClickCoin(coin: IWalletAsset): void {
        this.clickedCoin.emit(coin);
    }
}
