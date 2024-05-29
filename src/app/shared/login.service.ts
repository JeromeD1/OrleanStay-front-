import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  userRole$$ = signal<"user" | "admin" | null>(null)

  getUserRole(): "user" | "admin" | null {
    return this.userRole$$()  }

  login(data: any): Observable<{role: "user" | "admin" | null}> {
    return this.http.post<{role: "user" | "admin" | null}>(environment.BACKEND_BASE_URL + '/login', data).pipe(
      tap(res => {
        console.log("res : ", res);
        
        this.userRole$$.set(res.role)
      })
      )
  }

  logout():Observable<any> {
    return this.http.get(environment.BACKEND_BASE_URL + '/logout', { withCredentials: true }).pipe(
      tap((res) => {
        console.log("logged out", "res", res);
        
      })
      )
  }
}
