import { IProfileAssets } from '../../profile';
import { ICoin } from '../../coin-list';

export interface IWalletParams extends IProfileAssets {
    baseCoin: ICoin;
}
