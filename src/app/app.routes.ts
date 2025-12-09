import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/watchlist' },
    {
        path: 'watchlist',
        loadChildren: () => import('./pages/watchlist/watchlist.routes').then((m) => m.WATCHLIST_ROUTES),
    },
    {
        path: 'converter',
        loadChildren: () => import('./pages/converter/converter.routes').then((m) => m.CONVERTER_ROUTES),
    },
    {
        path: 'wallet',
        loadChildren: () => import('./pages/wallet/wallet.routes').then((m) => m.WALLET_ROUTES),
    },
];
