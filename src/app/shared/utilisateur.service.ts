import { Injectable } from '@angular/core';
import { AppstoreService } from './appstore.service';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/User.model';
import { environment } from '../../environment/environment';
import { Owner } from '../models/Owner.model';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  constructor(private appstore: AppstoreService, private http: HttpClient) { }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.BACKEND_BASE_URL}/utilisateurs`).pipe(
      tap((data) => this.appstore.setAllUsers(data))
    )
  }

  getAllOwners(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.BACKEND_BASE_URL}/utilisateurs/owner`).pipe(
      tap((data) => {
        const owners: Owner[] = data.map(user => {
          const owner: Owner = {
            id: user.id,
            firstname: user.personalInformations.firstname,
            lastname: user.personalInformations.lastname
          }
          return owner
        })

        this.appstore.setOwners(owners)
        
        return owners as unknown as Owner[]
      })
    )
  }
}
