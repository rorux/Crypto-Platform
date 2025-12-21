import { IBaseApiResponse } from '../../interfaces';
import { ICoinApiResponse } from '../interfaces';

export type CoinShortListApi = IBaseApiResponse<Pick<ICoinApiResponse, 'id'>[]>;
