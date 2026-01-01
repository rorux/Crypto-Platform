import { ICoin } from '../../coin-list';
import { IProfileAssetsCoin } from './profile-assets-coin.interface';

export interface IProfileAssetsDeal {
    type: 'purchase' | 'sale';
    coin: IProfileAssetsCoin;
    count: number;
    amount: number;
    baseCoin: ICoin;
    freeAmount: number;
}
