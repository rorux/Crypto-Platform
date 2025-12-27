import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { defaultCoinListParams, initialCoinListState } from '../../../constants';
import { CoinListSortDirection, CoinListSortedKey, ICoinListParams } from '../../../core';
import { AppStore, CoinListStore } from '../../../data';
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
    protected readonly appStore = inject(AppStore);
    protected readonly coinListStore = inject(CoinListStore);
    protected readonly numberFormatter = inject(NumberFormatter);
    protected readonly coinLabels = COIN_LABELS;
    protected readonly tableLabels = TABLE_LABELS;
    protected nameSortOrder: CoinListSortDirection | null = null;
    protected symbolSortOrder: CoinListSortDirection | null = null;
    protected priceSortOrder: CoinListSortDirection | null = null;
    protected circulatingSupplySortOrder: CoinListSortDirection | null = null;
    protected marketCapSortOrder: CoinListSortDirection | null = null;
    private coinListParams = signal<ICoinListParams>(defaultCoinListParams);

    constructor() {
        effect(() => {
            const baseCoin = this.appStore.baseCoin();
            const coinListParams = this.coinListParams();
            this.coinListStore.loadCoinList({ ...coinListParams, baseCoin });
        });
    }

    public ngOnInit(): void {
        const sort = this.coinListStore.sort() as CoinListSortedKey;
        const sortDirection = this.coinListStore.sortDirection() as CoinListSortDirection;

        this.setSortField(sort, sortDirection);
    }

    protected getTitleWithCurrency(title: string): string {
        return `${title}, ${this.appStore.baseCoin().symbol || ''}`;
    }

    protected onChangeQueryParams(params: NzTableQueryParams): void {
        const prevSort = this.coinListStore.sort();
        const prevSortDirection = this.coinListStore.sortDirection();
        let sort: CoinListSortedKey | null = null;
        let sortDirection: CoinListSortDirection | null = null;

        for (let i = 0; i < params.sort.length; i++) {
            if (params.sort[i].value) {
                sort = params.sort[i].key;
                sortDirection = params.sort[i].value as CoinListSortDirection;
                break;
            }

            if (i === params.sort.length - 1) {
                sort = initialCoinListState.sort;
                sortDirection = initialCoinListState.sortDirection;
            }
        }

        this.coinListParams.set({
            start: (params.pageIndex - 1) * params.pageSize + 1,
            limit: params.pageSize,
            sort: sort || prevSort,
            sortDirection: sortDirection || prevSortDirection,
            baseCoin: this.coinListParams().baseCoin,
        });
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
