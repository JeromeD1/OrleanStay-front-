import { Injectable, signal } from '@angular/core';
import { Traveller } from '../models/Traveller.model';
import { Reservation } from '../models/Reservation.model';

@Injectable({
  providedIn: 'root'
})
export class AppstoreService {

  constructor() { }

  traveller = signal<Traveller>({firstname: '',
  lastname: '',
  email: '',
  phone: '',
  address: '',
  zipcode: '',
  city: '',
  country: '',
})

userReservation = signal<Reservation>({
  checkinDate: null,
  checkoutDate: null,
  nbAdult: 0,
  nbBaby: 0,
  nbChild: 0
})

}
