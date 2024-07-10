import { Injectable, WritableSignal, signal } from '@angular/core'
import { Traveller } from '../models/Traveller.model'
import { Reservation } from '../models/Reservation.model'
import { Appartment } from '../models/Appartment.model'
import { User } from '../models/User.model'
import { AppartmentNameAndOwner } from '../models/AppartmentNameAndOwner.model'
import { Discount } from '../models/Discount.model'
import { Owner } from '../models/Owner.model'

@Injectable({
  providedIn: 'root'
})
export class AppstoreService {

  constructor() { }

  /***************Signal declarations ***************************/
    private _token = signal<string>("")

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
  private _appartmentNames = signal<AppartmentNameAndOwner[]>([])
  private _currentUsedAppartment = signal<Appartment | null>(null)

  private _currentUser = signal<User | null>(null)
  private _reservationRequests = signal<Reservation[]>([])

  private _discounts = signal<Discount[]>([])
  private _owners = signal<Owner[]>([])
  private _allUsers = signal<User[]>([])


  /*************Functions related to token **********************/
  getToken():string {
    return this._token()
  }

  setToken(token: string): void {
    this._token.set(token)
  }


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

  getAppartmentNames(): WritableSignal<AppartmentNameAndOwner[]> {
    return this._appartmentNames
  }

  getCurrentUsedAppartment(): WritableSignal<Appartment | null> {
    return this._currentUsedAppartment
  }

  setActiveAppartments(appartments: Appartment[]): void {
    this._activeAppartments.set(appartments)
  }

  setAllAppartments(appartments: Appartment[]): void {
    this._allAppartments.set(appartments)
  }
  setAppartmentNames(appartments: AppartmentNameAndOwner[]): void {
    this._appartmentNames.set(appartments)
  }

  setCurrentUsedAppartment(appartment: Appartment) {
    this._currentUsedAppartment.set(appartment)
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

  updateAppartment(appartment: Appartment): void {
    this._activeAppartments.update(appartments => 
      appartments.map(item => (
        item.id === appartment.id ? appartment : item
      ))
    )

    this._allAppartments.update(appartments => 
      appartments.map(item => (
        item.id === appartment.id ? appartment : item
      ))
    )

    this._appartmentNames.update(appartments =>
      appartments.map(item => (
        item.id === appartment.id ? {...item, name: appartment.name, ownerId: appartment.ownerId} : item
      ))
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

    resetTraveller(): void {
      this._traveller.set(
        {
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
        }
      )
    }


    /*******Functions related to reservationRequests */
    getReservationRequests(): WritableSignal<Reservation[]> {
      return this._reservationRequests
    }

    setReservationRequests(reservations:Reservation[]): void {
      this._reservationRequests.set(reservations)
    }

    updateReservationRequestsByReservation(reservationToUpdate: Reservation) {
      this._reservationRequests.update(value => value
        .map(resa => (
        resa.id == reservationToUpdate.id! ? reservationToUpdate : resa
      )))      
    }

    removeReservationInReservationRequests(reservation: Reservation) {
      this._reservationRequests.update(value => value
        .filter(resa => resa.id != reservation.id))
    }

    /******Functions related to discounts **************/
    getDiscounts(): WritableSignal<Discount[]> {
      return this._discounts
    }

    setDiscounts(discounts: Discount[]): void {
      this._discounts.set(discounts)
    }

    updateDiscount(discount: Discount): void {
      this._discounts.update(discounts => discounts.map(item => (
        item.id === discount.id ? discount : item
      )))
    }

    createDiscount(discount: Discount): void {
      const newDiscounts = this._discounts()
      newDiscounts.push(discount)
      this._discounts.set(newDiscounts)
    }

    /******Functions related to owners **************/
    getOwners(): WritableSignal<Owner[]> {
      return this._owners
    }

    setOwners(owners: Owner[]): void {
      this._owners.set(owners)
    }


    createOwner(owner: Owner): void {
      const newOwners = this._owners()
      newOwners.push(owner)
      this._owners.set(newOwners)
    }

        /******Functions related to allUsers **************/
        getAllUsers(): WritableSignal<User[]> {
          return this._allUsers
        }
    
        setAllUsers(users: User[]): void {
          this._allUsers.set(users)
        }
}
