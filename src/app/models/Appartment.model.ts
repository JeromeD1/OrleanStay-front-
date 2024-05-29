import { Photo } from "./Photo.model";
import { Reservation } from "./Reservation.model";
import { Info } from "./Info.model";
import { Discount } from "./Discount.model";
import { Owner } from "./Owner.model";


export class Appartment {


    constructor(
        public id: number,
        public owner: Owner,
        public discounts: Discount,
        public name: string,
        public description: string,
        public address: string,
        public zipcode: string,
        public city: string,
        public distanceCityCenter: string,
        public distanceTrain: string,
        public distanceTram: string,
        public googleMapUrl: string,
        public nightPrice: number,
        public caution: number,
        public menage_court_sejour: number,
        public menage_long_sejour: number,
        public menage_longue_duree: number,
        public type: string,
        public isActive: boolean,
        public infos: Info[],
        public photos: Photo[],
        public reservations: Reservation[],
    ) {
    }


    calculateReservationPrice(nbAdult: number, nbChild:number, checkinDate: Date, checkoutDate: Date) : number {
    
        const numberOfDays: number = Math.round((checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 3600 * 24));        
        const numberOfTravellers = nbAdult + nbChild;
        let updateNightPrice = this.nightPrice;
        let reservationPrice: number = 0;
        let cleaningPrice: number = 0;
    
        if(numberOfTravellers > 2) {
            updateNightPrice = this.nightPrice + 10 * (numberOfTravellers - 2);
        }
    
        if(numberOfDays < 3) {
            cleaningPrice = this.menage_court_sejour;
        } else if(numberOfDays < 190) {
            cleaningPrice = this.menage_long_sejour;
        } else {
            cleaningPrice = this.menage_longue_duree;
        }

        if(numberOfDays >= 7 && numberOfDays < 30){
            if(this.discounts.weekActivated){
                reservationPrice = updateNightPrice * numberOfDays * this.discounts.week + cleaningPrice;
            } else {
                reservationPrice = updateNightPrice * numberOfDays + cleaningPrice;
            }
        } else if(numberOfDays >= 30) {
            if(this.discounts.monthActivated){
                reservationPrice = updateNightPrice * numberOfDays * this.discounts.month + cleaningPrice;
            } else {
                reservationPrice = updateNightPrice * numberOfDays + cleaningPrice;
            }
        } else {
            reservationPrice = updateNightPrice * numberOfDays + cleaningPrice;
        }
    
        return reservationPrice;
    }
}

