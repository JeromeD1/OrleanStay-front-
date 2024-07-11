import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

import { environment } from '../../environment/environment';

import { Appartment } from '../models/Appartment.model';
import { Reservation } from '../models/Reservation.model';
import { AppstoreService } from './appstore.service';
import { AppartmentNameAndOwner } from '../models/AppartmentNameAndOwner.model';
import { AppartmentSaveRequest } from '../models/Request/AppartmentSaveRequest.model';
import { Info } from '../models/Info.model';
import { Photo } from '../models/Photo.model';


@Injectable({
  providedIn: 'root'
})
export class AppartmentsService {

  constructor(private http: HttpClient, private appstore: AppstoreService) { 
  }

  getAllAppartments():Observable<Appartment[]> {
    return this.http.get<Appartment[]>(environment.BACKEND_BASE_URL + '/appartment/all').pipe(
      map((appartments) => appartments.map(appartment => {
        
        //conversion de checkinDate et checkoutDate de reservations qui arrivent en string en Date
        const reservations = appartment.reservations.map(resa =>(
          resa.checkinDate && resa.checkoutDate ? 
          {...resa, checkinDate: new Date(resa.checkinDate), checkoutDate: new Date(resa.checkoutDate)}
          : resa
        ));

        
        return new Appartment(
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
        appartment.menageCourtSejour,
        appartment.menageLongSejour,
        appartment.menageLongueDuree,
        appartment.type,
        appartment.active,
        appartment.infos,
        appartment.photos,
        reservations,
        appartment.comments
      )}
      )
    ),
    tap((data: Appartment[]) => {
      this.appstore.setAllAppartments(data)
      
    })
    )

  }

  getActiveAppartments():Observable<Appartment[]> {    
    return this.http.get<Appartment[]>(environment.BACKEND_BASE_URL + '/appartment/active').pipe(
      map((appartments) => appartments.map(appartment => {

        //conversion de checkinDate et checkoutDate de reservations qui arrivent en string en Date
        const reservations = appartment.reservations.map(resa =>(
          resa.checkinDate && resa.checkoutDate ? 
          {...resa, checkinDate: new Date(resa.checkinDate), checkoutDate: new Date(resa.checkoutDate)}
          : resa
        ));

        
        return new Appartment(
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
          appartment.menageCourtSejour,
          appartment.menageLongSejour,
          appartment.menageLongueDuree,
          appartment.type,
          appartment.active,
          appartment.infos,
          appartment.photos,
          reservations,
          appartment.comments
      )}

      )
    ),
    tap((data: Appartment[]) => {
      this.appstore.setActiveAppartments(data)
      
    })
    )

  }


  getAppartmentsByOwnerId(id: number):Observable<Appartment[]> {    

    return this.http.get<Appartment[]>(environment.BACKEND_BASE_URL + `/appartment/owner/${id}`).pipe(
      map((appartments) => appartments.map(appartment => {

        //conversion de checkinDate et checkoutDate de reservations qui arrivent en string en Date
        const reservations = appartment.reservations.map(resa =>(
          resa.checkinDate && resa.checkoutDate ? 
          {...resa, checkinDate: new Date(resa.checkinDate), checkoutDate: new Date(resa.checkoutDate)}
          : resa
        ));

        
        return new Appartment(
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
          appartment.menageCourtSejour,
          appartment.menageLongSejour,
          appartment.menageLongueDuree,
          appartment.type,
          appartment.active,
          appartment.infos,
          appartment.photos,
          reservations,
          appartment.comments
      )}

      )
    ),
    tap((data: Appartment[]) => {
      this.appstore.setAllAppartments(data)
      
    })
    )

  }


  getAppartmentById(id: number):Observable<Appartment> {    

    return this.http.get<Appartment>(environment.BACKEND_BASE_URL + `/appartment/${id}`).pipe(
      tap((appartment) => {

        //conversion de checkinDate et checkoutDate de reservations qui arrivent en string en Date
        const reservations: Reservation[] = appartment.reservations.map(resa =>{
          const checkinDate = resa.checkinDate ? new Date(resa.checkinDate) : null
          const checkoutDate = resa.checkoutDate ? new Date(resa.checkoutDate) : null
          return {...resa, checkinDate: checkinDate, checkoutDate: checkoutDate}
        });

        const newAppartment: Appartment = new Appartment(
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
          appartment.menageCourtSejour,
          appartment.menageLongSejour,
          appartment.menageLongueDuree,
          appartment.type,
          appartment.active,
          appartment.infos,
          appartment.photos,
          reservations,
          appartment.comments
      )
      
      this.appstore.setCurrentUsedAppartment(newAppartment)
        
        return newAppartment
      }
      )
    )

  }

  getAppartmentNamesAndOwners(): Observable<AppartmentNameAndOwner[]> {
    return this.http.get<AppartmentNameAndOwner[]>(environment.BACKEND_BASE_URL + `/appartment/names`).pipe(
      tap((data) => this.appstore.setAppartmentNames(data))
    )
  }



  update(appartmentToUpdate: AppartmentSaveRequest): Observable<Appartment> {
    return this.http.put<Appartment>(environment.BACKEND_BASE_URL + `/appartment/${appartmentToUpdate.id}`, appartmentToUpdate).pipe(
    tap((appartment) => {
      //conversion de checkinDate et checkoutDate de reservations qui arrivent en string en Date
      const reservations: Reservation[] = appartment.reservations.map(resa =>{
        const checkinDate = resa.checkinDate ? new Date(resa.checkinDate) : null
        const checkoutDate = resa.checkoutDate ? new Date(resa.checkoutDate) : null
        return {...resa, checkinDate: checkinDate, checkoutDate: checkoutDate}
      });

      const newAppartment: Appartment = new Appartment(
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
        appartment.menageCourtSejour,
        appartment.menageLongSejour,
        appartment.menageLongueDuree,
        appartment.type,
        appartment.active,
        appartment.infos,
        appartment.photos,
        reservations,
        appartment.comments
    )
    
    this.appstore.updateAppartment(newAppartment)
    
    return newAppartment
  })
)
  }



  create(appartmentToCreate: AppartmentSaveRequest): Observable<Appartment> {
    return this.http.post<Appartment>(environment.BACKEND_BASE_URL + `/appartment`, appartmentToCreate).pipe(
    tap((appartment) => {
      console.log("appartment créé", appartment);
      
      //creation des tableaux vides
      const reservations: Reservation[] = []
      const infos: Info[] = []
      const photos: Photo[] = []

      const newAppartment: Appartment = new Appartment(
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
        appartment.menageCourtSejour,
        appartment.menageLongSejour,
        appartment.menageLongueDuree,
        appartment.type,
        appartment.active,
        infos,
        photos,
        reservations,
        appartment.comments
    )
    
    this.appstore.createAppartment(newAppartment)
    
    return newAppartment
  })
)
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.BACKEND_BASE_URL}/appartment/${id}`).pipe(
      tap(() => this.appstore.deleteAppartment(id))
    )
  }


}
