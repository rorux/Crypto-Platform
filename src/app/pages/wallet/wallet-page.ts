import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-wallet-page',
    imports: [],
    templateUrl: './wallet-page.html',
    styleUrl: './wallet-page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class WalletPage {}
