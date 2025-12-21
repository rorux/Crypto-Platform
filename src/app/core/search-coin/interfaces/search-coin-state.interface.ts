import { ICoin } from '../../coin-list';

export interface ISearchCoinState {
    loading: boolean;
    symbol: string;
    list: ICoin[];
}
