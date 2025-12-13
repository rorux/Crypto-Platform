import { Routes } from '@angular/router';
import { PAGES } from './constants';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: `/${PAGES.watchlist.path}` },
    {
        path: PAGES.watchlist.path,
        loadChildren: () => import('./pages/watchlist/watchlist.routes').then((m) => m.WATCHLIST_ROUTES),
    },
    {
        path: PAGES.converter.path,
        loadChildren: () => import('./pages/converter/converter.routes').then((m) => m.CONVERTER_ROUTES),
    },
    {
        path: PAGES.wallet.path,
        loadChildren: () => import('./pages/wallet/wallet.routes').then((m) => m.WALLET_ROUTES),
    },
    {
        path: '**',
        redirectTo: PAGES.watchlist.path,
    },
];
