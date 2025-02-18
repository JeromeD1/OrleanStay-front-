import { Injectable } from '@angular/core';
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
        const newNightPrice = appart.nightPrice + appart.prixPersonneSupplementaire * (numberOfTraveller - 2);
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

  convertToUTCDate = (time: Date): Date => {
    const day = time.getDate()
    const month = time.getMonth()
    const year = time.getFullYear()

    const UTCTime = new Date(Date.UTC(year,month,day))
    return new Date(UTCTime)
  }

  getInfoDiscountById(id: number, discounts: Discount[]): string | null {
    const discount: Discount | undefined = discounts.find(discount => discount.id === id)
    if(discount) {
      if(discount.weekActivated && discount.monthActivated) {
        return `${this.convertToPercent(discount?.week)} à la semaine - ${this.convertToPercent(discount?.month)} au mois`
      } else if(discount.weekActivated && !discount.monthActivated) {
        return `${this.convertToPercent(discount?.week)} à la semaine`
      } else if(!discount.weekActivated && discount.monthActivated) {
        return `${this.convertToPercent(discount?.month)} au mois`
      } else {
        return "Aucune réduction"
      }
    } else {
      return null
    }
  }

   extractIdFromUrl(url: string): string {
    const urlParts = url.split('/');
    const preLastPart = urlParts[urlParts.length - 2]
    const lastPart = urlParts[urlParts.length - 1];
    let id = lastPart.split('.')[0]; // Supprime l'extension (par exemple, ".png")

    if(preLastPart == "OrleanStay") {
      id = preLastPart + "/" + id
    }
  
    return id;
  }

  convertImgId(url: string): string {
    return url.replaceAll('/', '-')
  }


  private convertToPercent(value: number): string {
    return Math.round((1 - value) * 100) + "%"
  }

  setLunchTimeToDate(date: Date): Date {
    date.setHours(12,0,0)
    return date;
  }

  createDateWith24HoursLess(originalDate: Date) {
    let newDate = new Date(originalDate); 
    newDate.setHours(newDate.getHours() - 24); 
  
    return newDate; 
  }

  getYearsSelectOptions(): {value: number | null, label: string}[] {
    const options: {value: number | null, label: string}[] = []
    options.push({value: null, label: "---"})
    const now = new Date()
    const thisYear = now.getFullYear()
    for(let year = thisYear - 5; year <= thisYear + 5; year++) {
      options.push({value: year, label: year.toString()})
    }

    return options
  }

  getMonthSelectOptions(): {value: number | null, label: string}[] {
    const moisEnFrancais: string[] = [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]

    const options: {value: number | null, label: string}[] = []
    options.push({value: null, label: "---"})
    for(let month = 0; month < 12; month++) {
      options.push({value: month, label: moisEnFrancais[month]})
    }

    return options
  }

}
