import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Info } from '../models/Info.model';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environment/environment';
import { AppstoreService } from './appstore.service';

@Injectable({
  providedIn: 'root'
})
export class AppartmentInfoService {

  constructor(private readonly http: HttpClient, private readonly appstore: AppstoreService) { }

  updateAppartmentInfos(appartmentId: number, infos: Info[]): Observable<Info[]> {
      return this.http.put<Info[]>(`${environment.BACKEND_BASE_URL}/info/${appartmentId}`, {infos: infos}).pipe(
        tap((data) => {
          this.appstore.updateInfosInAppartment(data, appartmentId)
        })
      )
    }
}
