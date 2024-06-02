import { Injectable, signal } from '@angular/core'
import { Traveller } from '../models/Traveller.model'
import { Reservation } from '../models/Reservation.model'
import { Appartment } from '../models/Appartment.model'
import { User } from '../models/User.model'

@Injectable({
  providedIn: 'root'
})
export class AppstoreService {

  constructor() { }

  /***************Signal declarations ***************************/
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

  activeAppartments = signal<Appartment[]>([])
  allAppartments = signal<Appartment[]>([])

  currentUser = signal<User | null>(null)
  reservationRequests = signal<Reservation[]>([])


  /*************Functions related to userReservation *************/
  resetUserReservation(): void {
    this.userReservation.set({
      checkinDate: null,
      checkoutDate: null,
      nbAdult: 0,
      nbBaby: 0,
      nbChild: 0
    })
  }

  resetUserReservationTravellers(): void {
    this.userReservation.update(value => (
      {...value, nbAdult:0, nbBaby:0, nbChild:0}
    ))
  }

  updateUserReservationKey<T>(key: keyof Reservation, value: T){
    this.userReservation.update(previousState => (
      {...previousState, [key]: value}
    ))
  }

  /************Functions related to Appartments ****************/
  setActiveAppartments(appartments: Appartment[]): void {
    this.activeAppartments.set(appartments)
  }

  setAllAppartments(appartments: Appartment[]): void {
    this.allAppartments.set(appartments)
  }


  addReservationIntoAppartment(reservation: Reservation): void {
    //Ajout dans activeAppartments dans l'appartment de bon id
    this.activeAppartments.update(value => 
      value.map(appartment => {
        if (appartment.id === reservation.appartment_id) {
          appartment.addReservation(reservation)
          return appartment
        }
        return appartment
      })
    )

     //Ajout dans allAppartments dans l'appartment de bon id
     this.allAppartments.update(value => 
      value.map(appartment => {
        if (appartment.id === reservation.appartment_id) {
          appartment.addReservation(reservation)
          return appartment
        }
        return appartment
      })
    )
  }

  /********Functions related to currentUser *************/
  setCurrentUser(user: User): void {
    this.currentUser.set(user)
  }

  updateCurrentUserKey<K extends keyof User>(key: K, value: User[K]): void {
    if(this.currentUser()) {
      this.currentUser.update((previousState) => {
        const updatedState = {...previousState, [key]: value} as User;
        return updatedState;
      });
    }
  }  

    /********Functions related to traveller *************/
    setTraveller(traveller: Traveller): void {
      this.traveller.set(traveller)
    }


    /*******Functions related to reservationRequests */
    setReservationRequests(reservations:Reservation[]): void {
      this.reservationRequests.set(reservations)
    }
}
