import { IProfileAssetsCoin } from './profile-assets-coin.interface';

export interface IProfileAssets {
    freeAmount: number;
    currencyId: number;
    coins: IProfileAssetsCoin[];
}
