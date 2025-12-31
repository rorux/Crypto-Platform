import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Wallet } from '../../ui';

@Component({
    selector: 'app-wallet-page',
    imports: [Wallet],
    templateUrl: './wallet-page.html',
    styleUrl: './wallet-page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class WalletPage {}
