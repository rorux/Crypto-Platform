import { ICoin, IProfileFavourites } from '../../../../core';

export interface ICoinListSearchApiRequest {
    baseCoin: ICoin;
    symbol: string | null;
    favourites: IProfileFavourites;
}
