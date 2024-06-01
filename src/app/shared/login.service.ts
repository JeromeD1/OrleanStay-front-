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

  login(data: any): Observable<User> {
    return this.http.post<User>(environment.BACKEND_BASE_URL + '/login', data).pipe(
      tap(data => {
        console.log("data : ", data);
        this.appstore.setCurrentUser(data)
        this.appstore.setTraveller(
          {
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            phone: data.phone,
            address: data.address,
            zipcode: data.zipcode,
            city: data.city,
            country: data.country,
          }
        )
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
