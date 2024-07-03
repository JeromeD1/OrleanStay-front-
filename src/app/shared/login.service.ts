import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable, tap } from 'rxjs';
import { User } from '../models/User.model';
import { AppstoreService } from './appstore.service';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private appstore: AppstoreService) { }

  login(data: any): Observable<{token: string, utilisateur:User}> {
    return this.http.post<{token: string, utilisateur:User}>(environment.BACKEND_BASE_URL + '/login', data).pipe(
      tap(data => {
        console.log("data : ", data);
        this.appstore.setCurrentUser(data.utilisateur)
        console.log("currentUser login", this.appstore.getCurrentUser()());
        
        this.appstore.setTraveller(
          {
            personalInformations: {
              firstname: data.utilisateur.personalInformations.firstname,
              lastname: data.utilisateur.personalInformations.lastname,
              email: data.utilisateur.personalInformations.email,
              phone: data.utilisateur.personalInformations.phone,
              address: data.utilisateur.personalInformations.address,
              zipcode: data.utilisateur.personalInformations.zipcode,
              city: data.utilisateur.personalInformations.city,
              country: data.utilisateur.personalInformations.country
            }
            
          }
        )
        console.log("traveller login", this.appstore.getTraveller()());
        
      })
      )
  }

  logout():Observable<any> {
    return this.http.get(environment.BACKEND_BASE_URL + '/logout', { withCredentials: true }).pipe(
      tap((data) => {
        console.log("logged out", "data", data);
        
      })
      )
  }
}
