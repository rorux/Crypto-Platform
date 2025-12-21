import { ICoin } from '../interfaces';

export type CoinListSortedKey = Omit<keyof ICoin, 'id'>;
