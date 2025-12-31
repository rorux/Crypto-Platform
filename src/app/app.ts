import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DecimalPipe, registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AppStore, ICoinListSearchApiRequest, FavouritesStore, SearchCoinStore } from './data';
import { LOCALE_PROVIDER, PAGES } from './constants';
import { CoinSelect, NumberFormatter, Search, SEARCH_LABELS, SidebarLogo, SidebarMenu } from './ui';
import { ICoin } from './core';

registerLocaleData(localeRu);

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        NzIconModule,
        NzLayoutModule,
        NzMenuModule,
        SidebarMenu,
        SidebarLogo,
        Search,
        NzFlexDirective,
        CoinSelect,
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss',
    standalone: true,
    providers: [LOCALE_PROVIDER, FavouritesStore, AppStore, SearchCoinStore, NumberFormatter, DecimalPipe],
})
export class App {
    protected readonly favouritesStore = inject(FavouritesStore);
    protected readonly appStore = inject(AppStore);
    protected readonly searchCoinStore = inject(SearchCoinStore);
    private readonly destroyRef = inject(DestroyRef);

    private readonly pages = PAGES;
    protected pageTitle = PAGES.watchlist.title;
    protected currentPage: keyof typeof PAGES = 'converter';
    protected readonly searchLabels = SEARCH_LABELS;
    protected coinListSearchParams = signal<ICoinListSearchApiRequest>({
        symbol: null,
        baseCoin: this.appStore.baseCoin(),
        favourites: { list: this.favouritesStore.list() },
    });

    constructor(private router: Router) {
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((event: NavigationEnd) => {
                this.currentPage = event.urlAfterRedirects.substring(1) as keyof typeof PAGES;
                this.pageTitle = this.pages[this.currentPage] ? this.pages[this.currentPage].title : '';
            });

        effect(() => {
            const baseCoin = this.appStore.baseCoin();
            const coinListSearchParams = this.coinListSearchParams();
            if (coinListSearchParams.symbol) {
                this.searchCoinStore.loadCoinList({
                    ...coinListSearchParams,
                    baseCoin,
                    favourites: { list: this.favouritesStore.list() },
                });
            } else {
                this.searchCoinStore.clearState();
            }
        });

        this.favouritesStore.loadFavourites();
    }

    protected get showSearch() {
        return this.currentPage === 'watchlist';
    }

    protected get showCoinToggler() {
        return this.currentPage === 'watchlist' || this.currentPage === 'converter' || this.currentPage === 'wallet';
    }

    protected onSearch(symbol: string): void {
        const coinListSearchParams = this.coinListSearchParams();
        this.coinListSearchParams.set({ ...coinListSearchParams, symbol });
    }

    protected onCollapseMenu(): void {
        this.appStore.toggleMenuCollapse();
    }

    protected onChangeBaseCoin(coin: ICoin): void {
        this.appStore.setBaseCoin(coin);
    }
}
