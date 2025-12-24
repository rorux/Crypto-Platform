import { Component, DestroyRef, inject, LOCALE_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DecimalPipe, registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AppStore, SearchCoinStore } from './data';
import { PAGES } from './constants';
import { NumberFormatter, Search, SEARCH_LABELS, SidebarLogo, SidebarMenu } from './ui';

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
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss',
    standalone: true,
    providers: [{ provide: LOCALE_ID, useValue: 'ru' }, AppStore, SearchCoinStore, NumberFormatter, DecimalPipe],
})
export class App {
    protected readonly appStore = inject(AppStore);
    protected readonly searchCoinStore = inject(SearchCoinStore);
    private readonly destroyRef = inject(DestroyRef);

    private readonly pages = PAGES;
    protected pageTitle = PAGES.watchlist.title;
    protected currentPage: keyof typeof PAGES = 'converter';
    protected readonly searchLabels = SEARCH_LABELS;

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
    }

    protected get showSearch() {
        return this.currentPage === 'watchlist';
    }

    protected onSearch(symbol: string): void {
        this.searchCoinStore.loadCoinList(symbol);
    }

    protected onCollapseMenu(): void {
        this.appStore.toggleMenuCollapse();
    }
}
