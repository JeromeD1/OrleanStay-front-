import { Photo } from "./Photo.model";
import { Reservation } from "./Reservation.model";
import { Info } from "./Info.model";
import { Discount } from "./Discount.model";
import { AppartmentBusinessStat } from "./AppartmentBusinessStat.model";
import { YearBusinessStat } from "./YearBusinessStat.model";
import { Feedback } from "./Feedback.model";


export class Appartment {


    constructor(
        public id: number,
        public ownerId: number,
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
        public prixPersonneSupplementaire: number,
        public menageCourtSejour: number,
        public menageLongSejour: number,
        public menageLongueDuree: number,
        public type: string,
        public active: boolean,
        public infos: Info[],
        public photos: Photo[],
        public reservations: Reservation[],
        public comments: Feedback[]
    ) {
    }



    calculateReservationPrice(nbAdult: number, nbChild:number, checkinDate: Date, checkoutDate: Date) : number {
    
        const numberOfDays: number = Math.round((checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 3600 * 24));        
        const numberOfTravellers = Number(nbAdult) + Number(nbChild); //number ajouté car il y avait un problème non compris dans le calcul de numberOfTravellers
        let updateNightPrice = this.nightPrice;
        let reservationPrice: number = 0;
        let cleaningPrice: number = 0;
    
        if(numberOfTravellers > 2) {
            updateNightPrice = this.nightPrice + this.prixPersonneSupplementaire * (numberOfTravellers - 2);
        }

        if(numberOfDays < 3) {
            cleaningPrice = this.menageCourtSejour;
        } else if(numberOfDays < 190) {
            cleaningPrice = this.menageLongSejour;
        } else {
            cleaningPrice = this.menageLongueDuree;
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

    addReservation(reservation: Reservation): void {
        this.reservations.push(reservation)
    }

    removeReservation(reservation: Reservation): void {
        this.reservations = this.reservations.filter(resa => resa.id !== reservation.id)
    }

    updateReservation(reservation: Reservation): void {
        const newReservation = this.reservations.map(item => (
            item.id == reservation.id ? reservation : item
        ))

        this.reservations = newReservation
    }

    calculateBusinessStatistics(): AppartmentBusinessStat {
       const appartBusinessStat: AppartmentBusinessStat = {
        appartmentId: this.id,
        appartmentName: this.name,
        appartmentDescription: this.description,
        yearStatistics: []
       }

       const yearOptions = new Set(this.reservations.map(resa => resa.checkinDate!.getFullYear()).sort((a, b) => a - b))
       
       yearOptions.forEach(year => {
        const yearStat: YearBusinessStat = {
            year: year,
            monthlyEarns: [0,0,0,0,0,0,0,0,0,0,0,0],
            yearTotal: 0
        }

        this.reservations.forEach(resa => {
            const resaYear: number = resa.checkinDate!.getFullYear()
            const resaMonth: number = resa.checkinDate!.getMonth()
            if(resaYear === year && resa.accepted && !resa.cancelled) {
                yearStat.monthlyEarns[resaMonth] += resa.reservationPrice!
                yearStat.yearTotal += resa.reservationPrice!
            }
           })
           appartBusinessStat.yearStatistics.push(yearStat)
       })

       return appartBusinessStat
    }


    static createFromOtherAppartment(appart: Appartment): Appartment {
        return new Appartment(
            appart.id,
            appart.ownerId,
            appart.discounts,
            appart.name,
            appart.description,
            appart.address,
            appart.zipcode,
            appart.city,
            appart.distanceCityCenter,
            appart.distanceTrain,
            appart.distanceTram,
            appart.googleMapUrl,
            appart.nightPrice,
            appart.caution,
            appart.prixPersonneSupplementaire,
            appart.menageCourtSejour,
            appart.menageLongSejour,
            appart.menageLongueDuree,
            appart.type,
            appart.active,
            appart.infos,
            appart.photos,
            appart.reservations,
            appart.comments
        );
    }
}

