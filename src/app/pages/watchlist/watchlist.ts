import { Component } from '@angular/core';
import { CurrencyTable } from '../../components';

@Component({
    selector: 'app-watchlist',
    imports: [CurrencyTable],
    templateUrl: './watchlist.html',
    standalone: true,
    styleUrl: './watchlist.scss',
})
export class Watchlist {}
