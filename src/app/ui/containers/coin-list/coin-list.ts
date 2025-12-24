import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { CoinListSortDirection, CoinListSortedKey } from '../../../core';
import { CoinListStore, SearchCoinStore } from '../../../data';
import { DOLLAR_SIGN } from '../../../constants';
import { COIN_LABELS } from '../../labels';
import { NumberFormatter } from '../../formatters';

@Component({
    selector: 'app-coin-list',
    imports: [NzTableModule],
    templateUrl: './coin-list.html',
    styleUrl: './coin-list.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [CoinListStore],
})
export class CoinList implements OnInit {
    protected readonly coinListStore = inject(CoinListStore);
    protected readonly searchCoinStore = inject(SearchCoinStore);
    protected readonly numberFormatter = inject(NumberFormatter);
    protected readonly coinLabels = COIN_LABELS;
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

    protected onChangeQueryParams(params: NzTableQueryParams): void {
        this.coinListStore.changeQueryParams(params);
    }

    protected getTitleWithCurrency(title: string): string {
        return `${title}, ${DOLLAR_SIGN}`;
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
