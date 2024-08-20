import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable, tap } from 'rxjs';
import { User } from '../models/User.model';
import { AppstoreService } from './appstore.service';
import { UserSaveRequest } from '../models/Request/UserSaveRequest.model';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private appstore: AppstoreService) { }

  login(data: any): Observable<{token: string, utilisateur:User}> {
    return this.http.post<{token: string, utilisateur:User}>(environment.BACKEND_BASE_URL + '/login', data).pipe(
      tap(data => {
        const newUser:User = {...data.utilisateur, creationDate: new Date(data.utilisateur.creationDate)}
        this.appstore.setCurrentUser(newUser)
        
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

        this.appstore.setToken(`${data.token}`)

        localStorage.setItem("refreshToken", data.token)
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

  signup(newUser: UserSaveRequest): Observable<{token: string, utilisateur:User}> {
    return this.http.post<{token: string, utilisateur:User}>(environment.BACKEND_BASE_URL + '/signup', newUser).pipe(
      tap(data => {
        console.log("data signup", data);
        
        const newUser:User = {...data.utilisateur, creationDate: new Date(data.utilisateur.creationDate)}
        this.appstore.setCurrentUser(newUser)
        
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

        this.appstore.setToken(`${data.token}`)

        localStorage.setItem("refreshToken", data.token)
      })
      )
  }

  
}
