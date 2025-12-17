import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { CurrencyListSortDirection, CurrencyListSortedKey, ICurrencyListParams } from '../../../core';
import { CurrencyListStore } from '../../../data';
import { CURRENCY_LABELS } from '../../labels';

@Component({
    selector: 'app-currency-list',
    imports: [NzTableModule],
    templateUrl: './currency-list.html',
    styleUrl: './currency-list.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [CurrencyListStore],
})
export class CurrencyList implements OnInit {
    protected readonly currencyListStore = inject(CurrencyListStore);
    protected readonly currencyLabels = CURRENCY_LABELS;
    protected nameSortOrder: CurrencyListSortDirection | null = null;
    protected symbolSortOrder: CurrencyListSortDirection | null = null;
    protected priceSortOrder: CurrencyListSortDirection | null = null;
    protected circulatingSupplySortOrder: CurrencyListSortDirection | null = null;
    protected marketCapSortOrder: CurrencyListSortDirection | null = null;

    public ngOnInit(): void {
        const sort = this.currencyListStore.sort() as CurrencyListSortedKey;
        const sortDirection = this.currencyListStore.sortDirection() as CurrencyListSortDirection;

        this.setSortField(sort, sortDirection);
        this.currencyListStore.loadCurrencyList();
    }

    protected onQueryParamsChange(params: NzTableQueryParams): void {
        const prevSort = this.currencyListStore.sort() as CurrencyListSortedKey;
        const prevSortDirection = this.currencyListStore.sortDirection() as CurrencyListSortDirection;
        let sort: CurrencyListSortedKey | null = null;
        let sortDirection: CurrencyListSortDirection | null = null;

        for (let i = 0; i < params.sort.length; i++) {
            if (params.sort[i].value) {
                sort = params.sort[i].key;
                sortDirection = params.sort[i].value as CurrencyListSortDirection;
                break;
            }
        }

        const currencyListParams: ICurrencyListParams = {
            start: (params.pageIndex - 1) * params.pageSize + 1,
            limit: params.pageSize,
            sort: sort || prevSort,
            sortDirection: sortDirection || prevSortDirection,
        };

        this.currencyListStore.loadCurrencyList(currencyListParams);
    }

    private setSortField(sort: CurrencyListSortedKey, sortDirection: CurrencyListSortDirection): void {
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
