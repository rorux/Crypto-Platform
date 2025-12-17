import { Component } from '@angular/core';
import { CurrencyList } from '../../ui';

@Component({
    selector: 'app-watchlist',
    imports: [CurrencyList],
    templateUrl: './watchlist.html',
    standalone: true,
    styleUrl: './watchlist.scss',
})
export class Watchlist {}
