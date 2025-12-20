import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AppStore, SearchCurrencyStore } from './data';
import { PAGES } from './constants';
import { Search, SidebarLogo, SidebarMenu } from './ui';
import { SEARCH_LABELS } from './ui/labels';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, SidebarMenu, SidebarLogo, Search],
    templateUrl: './app.html',
    styleUrl: './app.scss',
    standalone: true,
    providers: [AppStore, SearchCurrencyStore],
})
export class App {
    protected readonly appStore = inject(AppStore);
    protected readonly searchCurrencyStore = inject(SearchCurrencyStore);
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
        this.searchCurrencyStore.loadCurrency(symbol);
    }

    protected onCollapseMenu(): void {
        this.appStore.toggleMenuCollapse();
    }
}
