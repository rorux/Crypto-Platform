import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IProfileAssets, IProfileFavourites } from '../../../core';

@Injectable({ providedIn: 'root' })
export class ProfileApiService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.profileApiUrl;

    public getFavourites(): Observable<IProfileFavourites> {
        return this.http.get<IProfileFavourites>(`${this.apiUrl}/favourites`);
    }

    public putFavourites(payload: IProfileFavourites): Observable<IProfileFavourites> {
        return this.http.put<IProfileFavourites>(`${this.apiUrl}/favourites`, payload);
    }

    public getAssets(): Observable<IProfileAssets> {
        return this.http.get<IProfileAssets>(`${this.apiUrl}/assets`);
    }

    public putAssets(payload: IProfileAssets): Observable<IProfileAssets> {
        return this.http.put<IProfileAssets>(`${this.apiUrl}/assets`, payload);
    }
}
