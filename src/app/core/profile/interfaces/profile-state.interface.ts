import { IProfileFavourites } from './profile-favourites.interface';

export interface IProfileState {
    loading: boolean;
    favourites: IProfileFavourites;
}
