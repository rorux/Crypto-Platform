import { ChangeDetectionStrategy, Component, computed, inject, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ICoin } from '../../../core';
import { AppStore, ProfileStore, SearchCoinStore } from '../../../data';
import { COIN_LABELS, TABLE_LABELS } from '../../labels';
import { NumberFormatter } from '../../formatters';
import { IChangeCoinFavouriteParams } from '../../interfaces';

@Component({
    selector: 'app-search-table',
    imports: [NzTableModule, NzCheckboxComponent, FormsModule],
    templateUrl: './search-table.html',
    styleUrl: './search-table.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class SearchTable {
    protected readonly profileStore = inject(ProfileStore);
    protected readonly appStore = inject(AppStore);
    protected readonly searchCoinStore = inject(SearchCoinStore);
    protected readonly numberFormatter = inject(NumberFormatter);
    protected readonly coinLabels = COIN_LABELS;
    protected readonly tableLabels = TABLE_LABELS;

    protected allCoins: Signal<ICoin[]> = this.searchCoinStore.list;
    protected pageIndex = signal(1);
    protected pageSize = signal(10);
    protected totalItems = computed(() => this.allCoins().length);

    protected onPageIndexChange(pageIndex: number): void {
        this.pageIndex.set(pageIndex);
    }

    protected onPageSizeChange(pageSize: number): void {
        this.pageSize.set(pageSize);
        this.pageIndex.set(1);
    }

    protected getTitleWithCurrency(title: string): string {
        return `${title}, ${this.appStore.baseCoin().symbol || ''}`;
    }

    protected onChangeFavourite(params: IChangeCoinFavouriteParams): void {
        if (params.checked) {
            this.profileStore.addFavourite(params.coin.id);
        } else {
            this.profileStore.removeFavourite(params.coin.id);
        }
    }
}
