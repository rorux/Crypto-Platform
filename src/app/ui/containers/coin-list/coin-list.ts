import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { SearchCoinStore } from '../../../data';
import { SearchTable, CoinListTable } from '../../components';

@Component({
    selector: 'app-coin-list',
    imports: [NzTableModule, SearchTable, CoinListTable],
    templateUrl: './coin-list.html',
    styleUrl: './coin-list.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [],
})
export class CoinList {
    protected readonly searchCoinStore = inject(SearchCoinStore);
}
