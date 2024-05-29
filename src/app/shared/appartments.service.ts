import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../environment/environment';

import { Appartment } from '../models/Appartment.model';
import { Reservation } from '../models/Reservation.model';


@Injectable({
  providedIn: 'root'
})
export class AppartmentsService {

  constructor(private http: HttpClient) { 
  }

  getAppartments():Observable<Appartment[]> {
    return this.http.get<Appartment[]>(environment.BACKEND_BASE_URL + '/appartments').pipe(
      map((appartments) => appartments.map(appartment => {
        
        //conversion de checkinDate et checkoutDate de reservations qui arrivent en string en Date
        const reservations = appartment.reservations.map(resa =>(
          resa.checkinDate && resa.checkoutDate ? 
          {...resa, checkinDate: new Date(resa.checkinDate), checkoutDate: new Date(resa.checkoutDate)}
          : resa
        ));

        
        return new Appartment(
        appartment.id,
        appartment.owner,
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
        appartment.menage_court_sejour,
        appartment.menage_long_sejour,
        appartment.menage_longue_duree,
        appartment.type,
        appartment.isActive,
        appartment.infos,
        appartment.photos,
        reservations
      )}
      )
    )
    )

  }

  getActiveAppartments():Observable<Appartment[]> {
    return this.http.get<Appartment[]>(environment.BACKEND_BASE_URL + '/activeAppartments').pipe(
      map((appartments) => appartments.map(appartment => {
        
        //conversion de checkinDate et checkoutDate de reservations qui arrivent en string en Date
        const reservations = appartment.reservations.map(resa =>(
          resa.checkinDate && resa.checkoutDate ? 
          {...resa, checkinDate: new Date(resa.checkinDate), checkoutDate: new Date(resa.checkoutDate)}
          : resa
        ));

        
        return new Appartment(
          appartment.id,
          appartment.owner,
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
          appartment.menage_court_sejour,
          appartment.menage_long_sejour,
          appartment.menage_longue_duree,
          appartment.type,
          appartment.isActive,
          appartment.infos,
          appartment.photos,
          reservations
      )}
      )
    )
    )

  }


}
