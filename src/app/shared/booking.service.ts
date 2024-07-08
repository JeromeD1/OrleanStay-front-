import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppstoreService } from './appstore.service';
import { Reservation } from '../models/Reservation.model';
import { environment } from '../../environment/environment';
import { Observable, map, tap } from 'rxjs';
import { ReservationRequest } from '../models/Request/ReservationRequest.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient, private appstore: AppstoreService) { }

  postTravellerReservation(reservationRequest: ReservationRequest): Observable<Reservation> {    
    return this.http.post<any>(environment.BACKEND_BASE_URL + '/reservation',reservationRequest).pipe(
      tap((response) => {        
        this.appstore.addReservationIntoAppartment(response)
      })
      )
    
  }

  getAllReservationRequests(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(environment.BACKEND_BASE_URL + '/reservation/requests/all').pipe(
      map((data) => {
        const newData = data.map((resa) => {
          const checkinDate = resa.checkinDate ? new Date(resa.checkinDate) : null
          const checkoutDate = resa.checkoutDate ? new Date(resa.checkoutDate) : null
          return {...resa, checkinDate: checkinDate, checkoutDate: checkoutDate}
        })
        return newData
      }),
      tap((data) => {this.appstore.setReservationRequests(data)})
    )
  }

  getReservationRequestsByOwnerId(ownerId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(environment.BACKEND_BASE_URL + `/reservation/requests/owner/${ownerId}`).pipe(
      map((data) => {
        const newData = data.map((resa) => {
          const checkinDate = resa.checkinDate ? new Date(resa.checkinDate) : null
          const checkoutDate = resa.checkoutDate ? new Date(resa.checkoutDate) : null
          return {...resa, checkinDate: checkinDate, checkoutDate: checkoutDate}
        })
        return newData
      }),
      tap((data) => {this.appstore.setReservationRequests(data)})
    )
  }

  askForDeposit(reservationToUpdate: Reservation) {
    return this.http.put<Reservation>(environment.BACKEND_BASE_URL + `/reservation/${reservationToUpdate.id!}/askForDeposit`, reservationToUpdate).pipe(
      tap((resa) => {
        const checkinDate = resa.checkinDate ? new Date(resa.checkinDate) : null
          const checkoutDate = resa.checkoutDate ? new Date(resa.checkoutDate) : null
          const updatedReservation: Reservation = {...resa, checkinDate: checkinDate, checkoutDate: checkoutDate}
          this.appstore.updateReservationRequestsByReservation(updatedReservation) 
          return updatedReservation
      })
    )
  }

  rejectReservation(reservationToUpdate: Reservation) {
    return this.http.put<Reservation>(environment.BACKEND_BASE_URL + `/reservation/${reservationToUpdate.id!}/reject`, reservationToUpdate).pipe(
      tap((resa) => {
        const checkinDate = resa.checkinDate ? new Date(resa.checkinDate) : null
          const checkoutDate = resa.checkoutDate ? new Date(resa.checkoutDate) : null
          const updatedReservation: Reservation = {...resa, checkinDate: checkinDate, checkoutDate: checkoutDate}
          this.appstore.removeReservationInReservationRequests(updatedReservation) 
      })
    )
  }

  acceptReservation(reservationToUpdate: Reservation) {
    return this.http.put<Reservation>(environment.BACKEND_BASE_URL + `/reservation/${reservationToUpdate.id!}/accept`, reservationToUpdate).pipe(
      tap((resa) => {
        const checkinDate = resa.checkinDate ? new Date(resa.checkinDate) : null
          const checkoutDate = resa.checkoutDate ? new Date(resa.checkoutDate) : null
          const updatedReservation: Reservation = {...resa, checkinDate: checkinDate, checkoutDate: checkoutDate}
          this.appstore.removeReservationInReservationRequests(updatedReservation) 
      })
    )
  }

}
