import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AppStore } from './store';
import { PAGES } from './constants';
import { SidebarLogo, SidebarMenu } from './components';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, SidebarMenu, SidebarLogo],
    templateUrl: './app.html',
    styleUrl: './app.scss',
    standalone: true,
    providers: [AppStore],
})
export class App {
    protected readonly appStore = inject(AppStore);
    private readonly destroyRef = inject(DestroyRef);

    private readonly pages = PAGES;
    protected pageTitle = PAGES.watchlist.title;

    constructor(private router: Router) {
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((event: NavigationEnd) => {
                const path = event.urlAfterRedirects.substring(1) as keyof typeof this.pages;
                this.pageTitle = this.pages[path] ? this.pages[path].title : '';
            });
    }

    protected onCollapseMenu(): void {
        this.appStore.toggleMenuCollapse();
    }
}
