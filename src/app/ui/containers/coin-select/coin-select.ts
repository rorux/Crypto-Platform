import {
    ChangeDetectionStrategy,
    Component,
    effect,
    inject,
    input,
    OnChanges,
    OnDestroy,
    output,
    SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ICoin } from '../../../core';
import { SearchCoinStore } from '../../../data';
import { SEARCH_LABELS } from '../../labels';

@Component({
    selector: 'app-coin-select',
    imports: [NzIconModule, NzSelectModule, FormsModule],
    templateUrl: './coin-select.html',
    styleUrl: './coin-select.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [SearchCoinStore],
})
export class CoinSelect implements OnChanges, OnDestroy {
    public initialCoin = input<ICoin | null>();
    public observeBaseCoinChanges = input<boolean>();
    public baseCoin = input<ICoin>();
    public selectCoin = output<ICoin>();
    public loading = output<boolean>();

    protected readonly searchCoinStore = inject(SearchCoinStore);
    protected readonly searchLabels = SEARCH_LABELS;
    protected selectedCoin: ICoin | null = null;
    private readonly searchChange$ = new BehaviorSubject('');
    private readonly debounceTime = 300;
    private subscription?: Subscription;

    constructor() {
        effect(() => {
            const initialCoin = this.initialCoin();

            if (initialCoin) {
                this.selectedCoin = initialCoin;
                this.searchCoinStore.setInitialCoin(initialCoin);
            }
        });

        effect(() => {
            const list = this.searchCoinStore.list();

            if (this.observeBaseCoinChanges() && this.selectedCoin) {
                const storeCoin = list.find((coin) => coin.id === this.selectedCoin?.id);

                if (storeCoin) {
                    this.selectCoin.emit(storeCoin);
                }
            }
        });

        effect(() => {
            this.loading.emit(this.searchCoinStore.loading());
        });

        this.subscription = this.searchChange$
            .pipe(debounceTime(this.debounceTime), distinctUntilChanged())
            .subscribe((symbol: string) => {
                const baseCoin = this.baseCoin();

                if (symbol && baseCoin) {
                    this.searchCoinStore.loadCoinList({ symbol, baseCoin });
                }
            });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['baseCoin'] && !changes['baseCoin'].firstChange && this.observeBaseCoinChanges()) {
            if (this.selectedCoin) {
                const { symbol } = this.selectedCoin;
                const baseCoin = changes['baseCoin'].currentValue;

                this.searchCoinStore.loadCoinList({ symbol, baseCoin });
            }
        }
    }

    public ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    protected onSearch(value: string): void {
        this.searchChange$.next(value);
    }

    protected onSelectCoin(coin: ICoin): void {
        this.selectedCoin = coin;
        this.selectCoin.emit(coin);
    }

    protected getCoinLabel(coin: ICoin): string {
        return `${coin.name} (${coin.symbol})`;
    }
}
