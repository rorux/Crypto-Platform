export interface ICoin {
    id: number;
    name: string;
    symbol: string;
    price?: number;
    circulatingSupply?: number;
    marketCap?: number;
}
