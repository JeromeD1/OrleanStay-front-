import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppstoreService } from './appstore.service';
import { Traveller } from '../models/Traveller.model';
import { Reservation } from '../models/Reservation.model';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingServiceService {

  constructor(private http: HttpClient, appstore: AppstoreService) { }

  postTravellerReservation(userReservation: Reservation, traveller: Traveller): void {
    const body = {
      reservation: userReservation,
      traveller: traveller
    }
    
    this.http.post(environment.BACKEND_BASE_URL + '/reservationWithTraveller',body).subscribe(
      {
        next: (response) => {
          
        },
        error: (error) => {
          console.error('Erreur lors de la requete : ', error);
      }}
    )
  }
}
