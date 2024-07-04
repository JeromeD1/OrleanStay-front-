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
        const newUser:User = {...data.utilisateur, creationDate: new Date(data.utilisateur.creationDate)}
        this.appstore.setCurrentUser(newUser)
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

        this.appstore.setToken(`${data.token}`)
        console.log("token :", this.appstore.getToken());
        
        
      })
      )
  }

  logout():Observable<any> {
    return this.http.post<void>(environment.BACKEND_BASE_URL + '/logMeOut', null).pipe(
      tap(() => {
        this.appstore.setToken("")
        this.appstore.resetTraveller();
      })
      )
  }
}
