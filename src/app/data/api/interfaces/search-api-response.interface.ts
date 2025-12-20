export interface ISearchApiResponse<T> {
    status: {
        error_code: number;
        error_message: string | null;
        credit_count: number;
    };
    data: Record<string, T>;
}
