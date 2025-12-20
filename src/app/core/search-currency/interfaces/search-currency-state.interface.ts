import { ICurrency } from '../../currency-list';

export interface ISearchCurrencyState {
    loading: boolean;
    symbol: string;
    list: ICurrency[];
}
