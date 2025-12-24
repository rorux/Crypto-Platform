import { IConverterApiRequest } from '../../../data';
import { ICoin } from '../../coin-list';

export interface IConverterState extends IConverterApiRequest {
    loading: boolean;
    coin: ICoin | null;
}
