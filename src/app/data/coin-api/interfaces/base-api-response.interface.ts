export interface IBaseApiResponse<T> {
    status: {
        error_code: number;
        error_message: string | null;
        credit_count: number;
        total_count?: number;
    };
    data: T;
}
