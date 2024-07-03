import { Injectable, WritableSignal, signal } from '@angular/core'
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
    private _traveller = signal<Traveller>({
      personalInformations: {
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        address: '',
        zipcode: '',
        city: '',
        country: ''
      }
    })

  private _userReservation = signal<Reservation>({
    checkinDate: null,
    checkoutDate: null,
    nbAdult: 0,
    nbBaby: 0,
    nbChild: 0
  })

  private _activeAppartments = signal<Appartment[]>([])
  private _allAppartments = signal<Appartment[]>([])

  private _currentUser = signal<User | null>(null)
  _reservationRequests = signal<Reservation[]>([])


  /*************Functions related to userReservation *************/

  getUserReservation(): WritableSignal<Reservation> {
    return this._userReservation
  }

  resetUserReservation(): void {
    this._userReservation.set({
      checkinDate: null,
      checkoutDate: null,
      nbAdult: 0,
      nbBaby: 0,
      nbChild: 0
    })
  }

  resetUserReservationTravellers(): void {
    this._userReservation.update(value => (
      {...value, nbAdult:0, nbBaby:0, nbChild:0}
    ))
  }

  updateUserReservationKey<T>(key: keyof Reservation, value: T){
    this._userReservation.update(previousState => (
      {...previousState, [key]: value}
    ))
  }

  /************Functions related to Appartments ****************/
  getActiveAppartments(): WritableSignal<Appartment[]> {
    return this._activeAppartments
  }

  getAllAppartments(): WritableSignal<Appartment[]> {
    return this._allAppartments
  }

  setActiveAppartments(appartments: Appartment[]): void {
    this._activeAppartments.set(appartments)
  }

  setAllAppartments(appartments: Appartment[]): void {
    this._allAppartments.set(appartments)
  }


  addReservationIntoAppartment(reservation: any): void {
    const newReservation: Reservation = {...reservation, checkinDate: new Date(reservation.checkinDate), checkoutDate: new Date(reservation.checkoutDate)}
    //Ajout dans activeAppartments dans l'appartment de bon id
    this._activeAppartments.update(value => 
      value.map(appartment => {
        if (appartment.id === reservation.appartmentId) {
          appartment.addReservation(newReservation)
          return appartment
        }
        return appartment
      })
    )

     //Ajout dans allAppartments dans l'appartment de bon id
     this._allAppartments.update(value => 
      value.map(appartment => {
        if (appartment.id === reservation.appartmentId) {
          appartment.addReservation(newReservation)
          return appartment
        }
        return appartment
      })
    )
  }

  /********Functions related to currentUser *************/
  getCurrentUser(): WritableSignal<User | null> {
    return this._currentUser
  }

  setCurrentUser(user: User): void {
    this._currentUser.set(user)
  }

  updateCurrentUserKey<K extends keyof User>(key: K, value: User[K]): void {
    if(this._currentUser()) {
      this._currentUser.update((previousState) => {
        const updatedState = {...previousState, [key]: value} as User;
        return updatedState;
      });
    }
  }  

    /********Functions related to traveller *************/
    getTraveller(): WritableSignal<Traveller> {
      return this._traveller
    }

    setTraveller(traveller: Traveller): void {
      this._traveller.set(traveller)
    }


    /*******Functions related to reservationRequests */
    getReservationRequests(): WritableSignal<Reservation[]> {
      return this._reservationRequests
    }

    setReservationRequests(reservations:Reservation[]): void {
      this._reservationRequests.set(reservations)
    }
}
