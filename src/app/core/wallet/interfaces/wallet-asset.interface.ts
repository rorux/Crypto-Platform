import { ICoin } from '../../coin-list';

export interface IWalletAsset extends ICoin {
    count: number;
    totalPrice: number;
}
