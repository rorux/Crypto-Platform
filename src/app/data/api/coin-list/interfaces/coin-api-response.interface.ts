export interface ICoinApiResponse {
    id: number;
    name: string;
    symbol: string;
    circulating_supply: number;
    quote: {
        USD: {
            price: number;
            market_cap: number;
        };
    };
}
