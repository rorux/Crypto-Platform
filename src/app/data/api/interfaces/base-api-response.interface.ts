export interface IBaseApiResponse<T> {
    status: {
        error_code: number;
        error_message: string | null;
        total_count: number;
    };
    data: T[];
}
