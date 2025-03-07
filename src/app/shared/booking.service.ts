import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppstoreService } from './appstore.service';
import { Reservation } from '../models/Reservation.model';
import { environment } from '../../environment/environment';
import { Observable, map, tap } from 'rxjs';
import { ReservationRequest } from '../models/Request/ReservationRequest.model';
import { SomeFunctionsService } from './some-functions.service';
import { ReservationResearchRequest } from '../models/Request/ReservationResearchRequest.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private readonly http: HttpClient, private readonly appstore: AppstoreService, private readonly someFunctions: SomeFunctionsService) { }

  postTravellerReservation(reservationRequest: ReservationRequest): Observable<Reservation> {    
    return this.http.post<any>(environment.BACKEND_BASE_URL + '/reservation',reservationRequest).pipe(
      tap((response) => {    
        this.appstore.addReservationIntoAppartment(response)
      })
      )
  }

  update(reservationRequest: ReservationRequest, reservationId: number): Observable<Reservation> {  
    return this.http.put<any>(environment.BACKEND_BASE_URL + '/reservation/' + reservationId, reservationRequest).pipe(
      map((data) => {
          const checkinDate = data.checkinDate ? this.someFunctions.setLunchTimeToDate(new Date(data.checkinDate)) : null
          const checkoutDate = data.checkoutDate ? this.someFunctions.setLunchTimeToDate(new Date(data.checkoutDate)) : null
          return {...data, checkinDate: checkinDate, checkoutDate: checkoutDate}
      }),
      tap((response) => {    
        this.appstore.updateReservationIntoAppartment(response)
      })
      )
  }

  cancelFromTraveller(reservationRequest: Reservation): Observable<Reservation> {    
    
    return this.http.put<any>(environment.BACKEND_BASE_URL + `/reservation/${reservationRequest.id}/cancelFromTraveller`, reservationRequest).pipe(
      map((data) => {
          const checkinDate = data.checkinDate ? this.someFunctions.setLunchTimeToDate(new Date(data.checkinDate)) : null
          const checkoutDate = data.checkoutDate ? this.someFunctions.setLunchTimeToDate(new Date(data.checkoutDate)) : null
          return {...data, checkinDate: checkinDate, checkoutDate: checkoutDate}
      }),
      tap((response) => {                
        this.appstore.updateReservationIntoAppartment(response)
      })
      )
  }

  getAllReservationRequests(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(environment.BACKEND_BASE_URL + '/reservation/requests/all').pipe(
      map((data) => {
        const newData = data.map((resa) => {
          const checkinDate = resa.checkinDate ? this.someFunctions.setLunchTimeToDate(new Date(resa.checkinDate)) : null
          const checkoutDate = resa.checkoutDate ? this.someFunctions.setLunchTimeToDate(new Date(resa.checkoutDate)) : null
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
          const checkinDate = resa.checkinDate ? this.someFunctions.setLunchTimeToDate(new Date(resa.checkinDate)) : null
          const checkoutDate = resa.checkoutDate ? this.someFunctions.setLunchTimeToDate(new Date(resa.checkoutDate)) : null
          return {...resa, checkinDate: checkinDate, checkoutDate: checkoutDate}
        })
        return newData
      }),
      tap((data) => {this.appstore.setReservationRequests(data)})
    )
  }

  getReservationRequestsWithCriteria(data: ReservationResearchRequest): Observable<Reservation[]> {
    return this.http.post<Reservation[]>(environment.BACKEND_BASE_URL + `/reservation/findWithCriteria`, data).pipe(
      map((data) => {
        const newData = data.map((resa) => {
          const checkinDate = resa.checkinDate ? this.someFunctions.setLunchTimeToDate(new Date(resa.checkinDate)) : null
          const checkoutDate = resa.checkoutDate ? this.someFunctions.setLunchTimeToDate(new Date(resa.checkoutDate)) : null
          return {...resa, checkinDate: checkinDate, checkoutDate: checkoutDate}
        })
        return newData
      })
    )
  }

  askForDeposit(reservationToUpdate: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(environment.BACKEND_BASE_URL + `/reservation/${reservationToUpdate.id!}/askForDeposit`, reservationToUpdate).pipe(
      tap((resa) => {
        const checkinDate = resa.checkinDate ? new Date(resa.checkinDate) : null
          const checkoutDate = resa.checkoutDate ? new Date(resa.checkoutDate) : null
          const updatedReservation: Reservation = {...resa, checkinDate: checkinDate, checkoutDate: checkoutDate}
          this.appstore.updateReservationRequestsByReservation(updatedReservation) 
          this.appstore.updateReservationIntoAppartment(updatedReservation)
          return updatedReservation
      })
    )
  }

  rejectReservation(reservationToUpdate: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(environment.BACKEND_BASE_URL + `/reservation/${reservationToUpdate.id!}/reject`, reservationToUpdate).pipe(
      tap((resa) => {
        const checkinDate = resa.checkinDate ? new Date(resa.checkinDate) : null
          const checkoutDate = resa.checkoutDate ? new Date(resa.checkoutDate) : null
          const updatedReservation: Reservation = {...resa, checkinDate: checkinDate, checkoutDate: checkoutDate}
          this.appstore.removeReservationInReservationRequests(updatedReservation) 
          this.appstore.updateReservationIntoAppartment(updatedReservation)
      })
    )
  }

  acceptReservation(reservationToUpdate: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(environment.BACKEND_BASE_URL + `/reservation/${reservationToUpdate.id!}/accept`, reservationToUpdate).pipe(
      tap((resa) => {
        const checkinDate = resa.checkinDate ? new Date(resa.checkinDate) : null
          const checkoutDate = resa.checkoutDate ? new Date(resa.checkoutDate) : null
          const updatedReservation: Reservation = {...resa, checkinDate: checkinDate, checkoutDate: checkoutDate}
          this.appstore.removeReservationInReservationRequests(updatedReservation) 
          this.appstore.updateReservationIntoAppartment(updatedReservation)
      })
    )
  }

  getReservationsByUserId(userId: number) : Observable<Reservation[]> {
    return this.http.get<Reservation[]>(environment.BACKEND_BASE_URL + `/reservation/user/${userId}`)
  }

  findFilteredReservationsForReservationChatAnswering(userId: number) : Observable<Reservation[]> {
    return this.http.get<Reservation[]>(environment.BACKEND_BASE_URL + `/reservation/withWaitingReservationChat/notFromUser/${userId}`)
  }

  findwithCheckoutDateLaterThanOneMonthAgo() : Observable<Reservation[]> {
    return this.http.get<Reservation[]>(environment.BACKEND_BASE_URL + `/reservation/withCheckoutDateLaterThanOneMonthAgo`)
  }

  sendInfoTravelEmail(reservationId: number): Observable<number> {
    return this.http.get<number>(environment.BACKEND_BASE_URL + `/reservation/sendInfoTravelEmail/${reservationId}`)
  }
}
