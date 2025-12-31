import { ICoin } from '../../coin-list';
import { IWalletAsset } from './wallet-asset.interface';

export interface IWalletState {
    loading: boolean;
    freeAmount: ICoin;
    assets: IWalletAsset[];
    assetsValue: number;
}
