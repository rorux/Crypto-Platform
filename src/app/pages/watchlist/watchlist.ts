import { Component } from '@angular/core';
import { CoinList } from '../../ui';

@Component({
    selector: 'app-watchlist',
    imports: [CoinList],
    templateUrl: './watchlist.html',
    standalone: true,
    styleUrl: './watchlist.scss',
})
export class Watchlist {}
