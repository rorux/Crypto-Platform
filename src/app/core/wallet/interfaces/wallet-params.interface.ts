import { IProfileAssets, IProfileFavourites } from '../../profile';
import { ICoin } from '../../coin-list';

export interface IWalletParams extends IProfileAssets {
    baseCoin: ICoin;
    favourites: IProfileFavourites;
}
