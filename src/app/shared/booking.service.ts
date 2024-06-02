import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppstoreService } from './appstore.service';
import { Traveller } from '../models/Traveller.model';
import { Reservation } from '../models/Reservation.model';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient, private appstore: AppstoreService) { }

  postTravellerReservation(userReservation: Reservation, traveller: Traveller): void {
    const currentUser = this.appstore.currentUser()

    const body = {
      reservation: userReservation,
      traveller: currentUser ? {...traveller, userId: currentUser.id} : traveller
    }
    
    this.http.post<Reservation>(environment.BACKEND_BASE_URL + '/reservationWithTraveller',body).subscribe(
      {
        next: (response) => {
          this.appstore.addReservationIntoAppartment(response)
        },
        error: (error) => {
          console.error('Erreur lors de la requete : ', error);
      }}
    )
  }
}
