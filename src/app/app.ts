import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AppStore } from './store';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, RouterLink],
    templateUrl: './app.html',
    styleUrl: './app.scss',
    standalone: true,
    providers: [AppStore],
})
export class App {
    protected readonly appStore = inject(AppStore);

    protected onCollapse(): void {
        this.appStore.toggleMenuCollapse();
    }
}
