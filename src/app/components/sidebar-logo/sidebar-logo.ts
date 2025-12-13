import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { APP_LABELS } from '../../labels';

@Component({
    selector: 'app-sidebar-logo',
    imports: [],
    templateUrl: './sidebar-logo.html',
    styleUrl: './sidebar-logo.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class SidebarLogo {
    public isMenuCollapsed = input(false);

    protected readonly title = APP_LABELS.title;
}
