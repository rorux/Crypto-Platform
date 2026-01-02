import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ThemeService } from '../../theme';

@Component({
    selector: 'app-theme-switcher',
    imports: [CommonModule, NzSwitchModule, NzIconModule, FormsModule],
    templateUrl: './theme-switcher.html',
    styleUrl: './theme-switcher.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class ThemeSwitcher {
    protected readonly themeService = inject(ThemeService);
}
