import { Injectable, WritableSignal, signal } from '@angular/core'
import { Traveller } from '../models/Traveller.model'
import { Reservation } from '../models/Reservation.model'
import { Appartment } from '../models/Appartment.model'
import { User } from '../models/User.model'
import { AppartmentNameAndOwner } from '../models/AppartmentNameAndOwner.model'
import { Discount } from '../models/Discount.model'
import { Owner } from '../models/Owner.model'
import { Photo } from '../models/Photo.model'
import { SomeFunctionsService } from './some-functions.service'
import { Feedback } from '../models/Feedback.model'
import { Info } from '../models/Info.model'

@Injectable({
  providedIn: 'root'
})
export class AppstoreService {

  constructor(private readonly someFunctions: SomeFunctionsService) { }

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

  private _allFeedbacks = signal<Feedback[]>([])


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
    const newReservation: Reservation = {...reservation, checkinDate: this.someFunctions.setLunchTimeToDate(new Date(reservation.checkinDate)), checkoutDate: this.someFunctions.setLunchTimeToDate(new Date(reservation.checkoutDate))}
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

  updateReservationIntoAppartment(reservation: any) {
    const updatedReservation: Reservation = {...reservation, checkinDate: this.someFunctions.setLunchTimeToDate(new Date(reservation.checkinDate)), checkoutDate: this.someFunctions.setLunchTimeToDate(new Date(reservation.checkoutDate))}
    //Ajout dans activeAppartments dans l'appartment de bon id
    this._activeAppartments.update(value => 
      value.map(appartment => {
        if (appartment.id === reservation.appartmentId) {
          appartment.updateReservation(updatedReservation)
          // return appartment
          return Appartment.createFromOtherAppartment(appartment)
        }
        // return appartment
        return Appartment.createFromOtherAppartment(appartment)
      })
    )

     //Ajout dans allAppartments dans l'appartment de bon id
     this._allAppartments.update(value => 
      value.map(appartment => {
        if (appartment.id === reservation.appartmentId) {
          appartment.updateReservation(updatedReservation)
          // return appartment
          return Appartment.createFromOtherAppartment(appartment)
        }
        // return appartment
        return Appartment.createFromOtherAppartment(appartment)
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

  createAppartment(appartment: Appartment): void {
    if(appartment.active) {
      const newAppartments: Appartment[] = this._activeAppartments()
      newAppartments.push(appartment)
      this._activeAppartments.set(newAppartments)
    }

    const newAllAppartments: Appartment[] = this._allAppartments()
    newAllAppartments.push(appartment)
    this._allAppartments.set(newAllAppartments)

    const newAppartmentNames: AppartmentNameAndOwner[] = newAllAppartments.map(item => (
      {id: item.id, name: item.name, ownerId: item.ownerId}
    ))

    this._appartmentNames.set(newAppartmentNames)
  }

  deleteAppartment(id: number): void {
    const newActiveAppartment: Appartment[] = this._activeAppartments().filter(item => item.id != id)
    this._activeAppartments.set(newActiveAppartment)

    const newAllAppartments: Appartment[] = this._allAppartments().filter(item => item.id != id)
    this._allAppartments.set(newAllAppartments)

    const newAppartmentNames: AppartmentNameAndOwner[] = this._appartmentNames().filter(item => item.id != id)
    this._appartmentNames.set(newAppartmentNames)
  }

  addPhotoInAppartment(photos: Photo[]) {
  this._activeAppartments.update(allAppartments => {
    return allAppartments.map(appartment => {
      if (appartment.id === photos[0].appartmentId) {
        // Création d'un nouvel objet Appartment avec les photos mises à jour
        const updatedAppartment = new Appartment(
          appartment.id,
          appartment.ownerId,
          appartment.discounts,
          appartment.name,
          appartment.description,
          appartment.address,
          appartment.zipcode,
          appartment.city,
          appartment.distanceCityCenter,
          appartment.distanceTrain,
          appartment.distanceTram,
          appartment.googleMapUrl,
          appartment.nightPrice,
          appartment.caution,
          appartment.prixPersonneSupplementaire,
          appartment.menageCourtSejour,
          appartment.menageLongSejour,
          appartment.menageLongueDuree,
          appartment.type,
          appartment.active,
          appartment.infos,
          photos,  
          appartment.reservations,
          appartment.comments
        );

        return updatedAppartment;
      }
      return appartment;
    });
  });

    this._allAppartments.update(allAppartments => {
      return allAppartments.map(appartment => {
        if (appartment.id === photos[0].appartmentId) {
        // Création d'un nouvel objet Appartment avec les photos mises à jour
          const updatedAppartment = new Appartment(
            appartment.id,
            appartment.ownerId,
            appartment.discounts,
            appartment.name,
            appartment.description,
            appartment.address,
            appartment.zipcode,
            appartment.city,
            appartment.distanceCityCenter,
            appartment.distanceTrain,
            appartment.distanceTram,
            appartment.googleMapUrl,
            appartment.nightPrice,
            appartment.caution,
            appartment.prixPersonneSupplementaire,
            appartment.menageCourtSejour,
            appartment.menageLongSejour,
            appartment.menageLongueDuree,
            appartment.type,
            appartment.active,
            appartment.infos,
            photos,  
            appartment.reservations,
            appartment.comments
          );

          return updatedAppartment;
        }
        return appartment;
      });
    });
    
  }

  updatePhotoInAppartment(photo: Photo) {
    //update des active appartment
    this._activeAppartments.update(allAppartments => {
      return allAppartments.map(appartment => {
        if (appartment.id === photo.appartmentId) {
          const newPhotos = appartment.photos.map(item => (
            item.id === photo.id ? photo : item
          ))
          // Création d'un nouvel objet Appartment avec les photos mises à jour
          const updatedAppartment = new Appartment(
            appartment.id,
            appartment.ownerId,
            appartment.discounts,
            appartment.name,
            appartment.description,
            appartment.address,
            appartment.zipcode,
            appartment.city,
            appartment.distanceCityCenter,
            appartment.distanceTrain,
            appartment.distanceTram,
            appartment.googleMapUrl,
            appartment.nightPrice,
            appartment.caution,
            appartment.prixPersonneSupplementaire,
            appartment.menageCourtSejour,
            appartment.menageLongSejour,
            appartment.menageLongueDuree,
            appartment.type,
            appartment.active,
            appartment.infos,
            newPhotos,  
            appartment.reservations,
            appartment.comments
          );
  
          return updatedAppartment
        }
        return appartment
      })
    })

    // update de allAppartments
    this._allAppartments.update(allAppartments => {
      return allAppartments.map(appartment => {
        if (appartment.id === photo.appartmentId) {
          const newPhotos = appartment.photos.map(item => (
            item.id === photo.id ? photo : item
          ))
          // Création d'un nouvel objet Appartment avec les photos mises à jour
          const updatedAppartment = new Appartment(
            appartment.id,
            appartment.ownerId,
            appartment.discounts,
            appartment.name,
            appartment.description,
            appartment.address,
            appartment.zipcode,
            appartment.city,
            appartment.distanceCityCenter,
            appartment.distanceTrain,
            appartment.distanceTram,
            appartment.googleMapUrl,
            appartment.nightPrice,
            appartment.caution,
            appartment.prixPersonneSupplementaire,
            appartment.menageCourtSejour,
            appartment.menageLongSejour,
            appartment.menageLongueDuree,
            appartment.type,
            appartment.active,
            appartment.infos,
            newPhotos,  
            appartment.reservations,
            appartment.comments
          );
  
          return updatedAppartment
        }
        return appartment
      })
    })
  }

  deletePhotoInAppartment(photo: Photo) {
    //Mise à jour de currentUsedAppartment
    const currentAppartmentPhotos = this._currentUsedAppartment()?.photos
    const newAppartmentPhotos = currentAppartmentPhotos?.filter(item => item.id !== photo.id)

    const updatedAppartment: Appartment = new Appartment(
      this._currentUsedAppartment()!.id,
      this._currentUsedAppartment()!.ownerId,
        this._currentUsedAppartment()!.discounts,
        this._currentUsedAppartment()!.name,
        this._currentUsedAppartment()!.description,
        this._currentUsedAppartment()!.address,
        this._currentUsedAppartment()!.zipcode,
        this._currentUsedAppartment()!.city,
        this._currentUsedAppartment()!.distanceCityCenter,
        this._currentUsedAppartment()!.distanceTrain,
        this._currentUsedAppartment()!.distanceTram,
        this._currentUsedAppartment()!.googleMapUrl,
        this._currentUsedAppartment()!.nightPrice,
        this._currentUsedAppartment()!.caution,
        this._currentUsedAppartment()!.prixPersonneSupplementaire,
        this._currentUsedAppartment()!.menageCourtSejour,
        this._currentUsedAppartment()!.menageLongSejour,
        this._currentUsedAppartment()!.menageLongueDuree,
        this._currentUsedAppartment()!.type,
        this._currentUsedAppartment()!.active,
        this._currentUsedAppartment()!.infos,
        newAppartmentPhotos!,
        this._currentUsedAppartment()!.reservations,
        this._currentUsedAppartment()!.comments
    )
    this._currentUsedAppartment.set(updatedAppartment)

    //Mise à jour de allAppartments
    this._allAppartments.update(value => value.map(item => (
      item.id === this._currentUsedAppartment()!.id ? this._currentUsedAppartment()! : item 
    )))

    //Mise à jour de activeAppartments
    this._activeAppartments.update(value => value.map(item => (
      item.id === this._currentUsedAppartment()!.id ? this._currentUsedAppartment()! : item 
    )))
  }


  /*********************** */
  updateInfosInAppartment(infos: Info[], appartmentId: number) {
    this._activeAppartments.update(allAppartments => {
      return allAppartments.map(appartment => {
        if (appartment.id == appartmentId) {
          // Création d'un nouvel objet Appartment avec les photos mises à jour
          const updatedAppartment = new Appartment(
            appartment.id,
            appartment.ownerId,
            appartment.discounts,
            appartment.name,
            appartment.description,
            appartment.address,
            appartment.zipcode,
            appartment.city,
            appartment.distanceCityCenter,
            appartment.distanceTrain,
            appartment.distanceTram,
            appartment.googleMapUrl,
            appartment.nightPrice,
            appartment.caution,
            appartment.prixPersonneSupplementaire,
            appartment.menageCourtSejour,
            appartment.menageLongSejour,
            appartment.menageLongueDuree,
            appartment.type,
            appartment.active,
            infos,
            appartment.photos,  
            appartment.reservations,
            appartment.comments
          );
  
          return updatedAppartment;
        }
        return appartment;
      });
    });
  
      this._allAppartments.update(allAppartments => {
        return allAppartments.map(appartment => {
          if (appartment.id == appartmentId) {
          // Création d'un nouvel objet Appartment avec les photos mises à jour
            const updatedAppartment = new Appartment(
              appartment.id,
              appartment.ownerId,
              appartment.discounts,
              appartment.name,
              appartment.description,
              appartment.address,
              appartment.zipcode,
              appartment.city,
              appartment.distanceCityCenter,
              appartment.distanceTrain,
              appartment.distanceTram,
              appartment.googleMapUrl,
              appartment.nightPrice,
              appartment.caution,
              appartment.prixPersonneSupplementaire,
              appartment.menageCourtSejour,
              appartment.menageLongSejour,
              appartment.menageLongueDuree,
              appartment.type,
              appartment.active,
              infos,
              appartment.photos,  
              appartment.reservations,
              appartment.comments
            );
  
            return updatedAppartment;
          }
          return appartment;
        });
      });
      
    }


  /************************** */


  /********Functions related to currentUser *************/
  getCurrentUser(): WritableSignal<User | null> {
    return this._currentUser
  }

  setCurrentUser(user: User | null): void {
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

    updateOneUserInAllUsers(user: User): void {
      this._allUsers.update(value => value.map(item => (
        item.id === user.id ? {...user} : item
      )))
    }

    /********Functions related to feedbacks *************/
    getAllFeedbacks(): WritableSignal<Feedback[]> {
      return this._allFeedbacks
    }

    setAllFeedbacks(feedbacks: Feedback[]): void {
      this._allFeedbacks.set(feedbacks)
    }

    addFeedback(feedback: Feedback): void {
      this._allFeedbacks.update(value => [...value, feedback])
    }

    updateFeedback(feedback: Feedback): void {
      this._allFeedbacks.update(value => value.map(item => (
        item.id === feedback.id ? {...feedback} : item
      )))
    }

    removeFeedback(feedbackId: number) {
      this._allFeedbacks.update(value => value.filter(item => item.id != feedbackId))
    }

    removeAnswerInFeedback(answerId: number): void {
      this._allFeedbacks.update(value => value.map(item => (
        item.answer && item.answer.id === answerId ? {...item, answer: undefined} : {...item}
      ) ))
    }

    /****Reset des signaux réservés à la session lors du logout ******/
    resetAutenticatedSignals(): void {
      this._allAppartments.set([])
      this._appartmentNames.set([])
      this._currentUser.set(null)
      this._owners.set([])
      this._allUsers.set([])
      this._token.set("")
      this._reservationRequests.set([])
      this._currentUsedAppartment.set(null)

      localStorage.setItem("refreshToken", "")
    }
}
