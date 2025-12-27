import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { CoinListSortDirection, CoinListSortedKey } from '../../../core';
import { CoinListStore } from '../../../data';
import { DOLLAR_SIGN } from '../../../constants';
import { NumberFormatter } from '../../formatters';
import { COIN_LABELS, TABLE_LABELS } from '../../labels';

@Component({
    selector: 'app-coin-list-table',
    imports: [NzTableModule],
    templateUrl: './coin-list-table.html',
    styleUrl: './coin-list-table.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [CoinListStore],
})
export class CoinListTable implements OnInit {
    protected readonly coinListStore = inject(CoinListStore);
    protected readonly numberFormatter = inject(NumberFormatter);
    protected readonly coinLabels = COIN_LABELS;
    protected readonly tableLabels = TABLE_LABELS;
    protected nameSortOrder: CoinListSortDirection | null = null;
    protected symbolSortOrder: CoinListSortDirection | null = null;
    protected priceSortOrder: CoinListSortDirection | null = null;
    protected circulatingSupplySortOrder: CoinListSortDirection | null = null;
    protected marketCapSortOrder: CoinListSortDirection | null = null;

    public ngOnInit(): void {
        const sort = this.coinListStore.sort() as CoinListSortedKey;
        const sortDirection = this.coinListStore.sortDirection() as CoinListSortDirection;

        this.setSortField(sort, sortDirection);
        this.coinListStore.loadCoinList();
    }

    protected getTitleWithCurrency(title: string): string {
        return `${title}, ${DOLLAR_SIGN}`;
    }

    protected onChangeQueryParams(params: NzTableQueryParams): void {
        this.coinListStore.changeQueryParams(params);
    }

    private setSortField(sort: CoinListSortedKey, sortDirection: CoinListSortDirection): void {
        if (sort === 'name') {
            this.nameSortOrder = sortDirection;
        }
        if (sort === 'symbol') {
            this.symbolSortOrder = sortDirection;
        }
        if (sort === 'price') {
            this.priceSortOrder = sortDirection;
        }
        if (sort === 'circulatingSupply') {
            this.circulatingSupplySortOrder = sortDirection;
        }
        if (sort === 'marketCap') {
            this.marketCapSortOrder = sortDirection;
        }
    }
}
