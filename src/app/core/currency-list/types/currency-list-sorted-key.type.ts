import { ICurrency } from '../interfaces';

export type CurrencyListSortedKey = Omit<keyof ICurrency, 'id'>;
