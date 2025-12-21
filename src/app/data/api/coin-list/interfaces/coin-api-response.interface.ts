export interface ICoinApiResponse {
    id: string;
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
