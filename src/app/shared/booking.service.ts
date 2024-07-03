import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppstoreService } from './appstore.service';
import { Traveller } from '../models/Traveller.model';
import { Reservation } from '../models/Reservation.model';
import { environment } from '../../environment/environment';
import { Observable, tap } from 'rxjs';
import { ReservationRequest } from '../models/Request/ReservationRequest.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient, private appstore: AppstoreService) { }

  postTravellerReservation(reservationRequest: ReservationRequest): Observable<Reservation> {
    console.log("environment.BACKEND_BASE_URL ", environment.BACKEND_BASE_URL);
    console.log(reservationRequest);
    
    return this.http.post<any>(environment.BACKEND_BASE_URL + '/reservation',reservationRequest).pipe(
      tap((response) => {
        console.log("new reservation", response);
        
        this.appstore.addReservationIntoAppartment(response)
      })
      )
    
  }

  getReservationRequests(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(environment.BACKEND_BASE_URL + '/reservation/request').pipe(
      tap((data) => this.appstore.setReservationRequests(data))
    )
  }

}
