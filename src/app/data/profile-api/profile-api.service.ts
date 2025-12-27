import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IProfileFavourites } from '../../core/profile';

@Injectable({ providedIn: 'root' })
export class ProfileApiService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.profileApiUrl;

    public getFavourites(): Observable<IProfileFavourites> {
        return this.http.get<IProfileFavourites>(`${this.apiUrl}/favourites`);
    }
}
