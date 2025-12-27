import { ICoin } from '../../../../core';

export interface ICoinListSearchApiRequest {
    baseCoin: ICoin;
    symbol: string | null;
}
