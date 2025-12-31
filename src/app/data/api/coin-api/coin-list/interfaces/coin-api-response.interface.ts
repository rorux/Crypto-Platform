export interface ICoinApiResponse {
    id: number;
    name: string;
    symbol: string;
    circulating_supply?: number;
    quote: {
        [key in string]: {
            price: number;
            market_cap?: number;
        };
    };
}
