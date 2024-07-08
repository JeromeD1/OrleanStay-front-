import { Injectable } from '@angular/core';
import { Traveller } from "../models/Traveller.model";
import { Appartment } from "../models/Appartment.model";
import { Discount } from '../models/Discount.model';
import { Reservation } from '../models/Reservation.model';

@Injectable({
  providedIn: 'root'
})
export class SomeFunctionsService {

  constructor() { }

  getTravelPrice = (resa: Reservation, appart: Appartment): number | null => {
    if(resa.checkinDate && resa.checkoutDate && resa.nbAdult > 0) {

      return appart.calculateReservationPrice(
        resa.nbAdult,
        resa.nbChild, 
        resa.checkinDate,
        resa.checkoutDate, 
        );
    } else {
      return null;
    }
  }

  getNightPrice(resa: Reservation, appart: Appartment): number {

    const numberOfTraveller = resa.nbAdult + resa.nbChild;
    if(resa.nbAdult > 0 && numberOfTraveller > 2) {
        const newNightPrice = appart.nightPrice + 10 * (numberOfTraveller - 2);
        return newNightPrice;
      }
     else {
      return appart.nightPrice;
    }
  }

  getNumberOfDays(resa: Reservation): number | null {
    if(resa.checkinDate && resa.checkoutDate) {
      return Math.round((resa.checkoutDate.getTime() - resa.checkinDate.getTime()) / (1000 * 3600 * 24)); //(checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 3600 * 24)
    } else {
      return null;
    }
  }

  formatDate = (date: Date | null, arriveOuDepart: "arrive" | "depart"):string => {
    if(date){
      let day: string = date.getDate().toString();  // Jour du mois
      let month: string = (date.getMonth() + 1).toString();  // Les mois sont indexés à partir de 0 en JavaScript
      let year: string = date.getFullYear().toString();
      
      // Ajoute un zéro devant le jour et le mois si nécessaire
      if(day.length < 1) day = '0' + day;
      if(month.length < 2) month = '0' + month;
      
      return day + '/' + month + '/' + year;
    }
  
    return arriveOuDepart === "arrive" ? "Choisissez une date d'arrivée" : "Choisissez une date de départ";
  }
}
