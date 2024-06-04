import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppstoreService } from './appstore.service';
import { Traveller } from '../models/Traveller.model';
import { Reservation } from '../models/Reservation.model';
import { environment } from '../../environment/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient, private appstore: AppstoreService) { }

  postTravellerReservation(userReservation: Reservation, traveller: Traveller): Observable<Reservation> {
    const currentUser = this.appstore.getCurrentUser()()

    const body = {
      reservation: userReservation,
      traveller: currentUser ? {...traveller, userId: currentUser.id} : traveller
    }
    
    return this.http.post<Reservation>(environment.BACKEND_BASE_URL + '/reservationWithTraveller',body).pipe(
      tap((response) => {
        this.appstore.addReservationIntoAppartment(response)
      })
      )
    
  }

  getReservationRequests(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(environment.BACKEND_BASE_URL + '/reservationRequests').pipe(
      tap((data) => this.appstore.setReservationRequests(data))
    )
  }

}
