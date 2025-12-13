import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { PAGES, SECTIONS } from '../../constants';

@Component({
    selector: 'app-sidebar-menu',
    imports: [RouterLink, NzMenuModule],
    templateUrl: './sidebar-menu.html',
    styleUrl: './sidebar-menu.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class SidebarMenu {
    protected readonly pages = PAGES;
    protected readonly sections = SECTIONS;
}
