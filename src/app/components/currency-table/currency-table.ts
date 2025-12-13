import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { ICurrencyTable } from '../../core';
import { CURRENCY_LABELS } from '../../labels';
import { DEFAULT_CURRENCY_TABLE } from '../../constants';

@Component({
    selector: 'app-currency-table',
    imports: [NzTableModule],
    templateUrl: './currency-table.html',
    styleUrl: './currency-table.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class CurrencyTable {
    public data: InputSignal<ICurrencyTable> = input(DEFAULT_CURRENCY_TABLE);

    protected readonly currencyLabels = CURRENCY_LABELS;

    protected onQueryParamsChange(params: NzTableQueryParams): void {
        console.log(params);
        const { pageSize, pageIndex, sort, filter } = params;
        const currentSort = sort.find((item) => item.value !== null);
        const sortField = (currentSort && currentSort.key) || null;
        const sortOrder = (currentSort && currentSort.value) || null;
    }
}
