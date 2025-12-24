import { Component } from '@angular/core';
import { CoinList } from '../../ui';

@Component({
    selector: 'app-watchlist-page',
    imports: [CoinList],
    templateUrl: './watchlist-page.html',
    standalone: true,
    styleUrl: './watchlist-page.scss',
})
export class WatchlistPage {}
