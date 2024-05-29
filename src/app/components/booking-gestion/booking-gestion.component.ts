import { Component, OnInit, OnDestroy, WritableSignal } from '@angular/core';
import { Traveller } from '../../models/Traveller.model';
// import { BookingDataService } from '../../../../../shared/booking-data.service';
import { Photo } from '../../models/Photo.model';
import { AppartmentsService } from '../../shared/appartments.service';
import { Appartment } from '../../models/Appartment.model';
// import { DiscountService } from '../../../../../shared/discount.service';
import { Discount } from '../../models/Discount.model';
import { Subject, takeUntil } from 'rxjs';
import { Reservation } from '../../models/Reservation.model';
import { AppstoreService } from '../../shared/appstore.service';
import { CommonModule } from '@angular/common';
import { AppartmentCardComponent } from '../appartment-card/appartment-card.component';
import { TravellingChoicesComponent } from '../travelling-choices/travelling-choices.component';


@Component({
  selector: 'app-booking-gestion',
  standalone: true,
  imports: [
    CommonModule,
    AppartmentCardComponent,
    TravellingChoicesComponent,
  ],
  templateUrl: './booking-gestion.component.html',
  styleUrl: './booking-gestion.component.scss'
})
export class BookingGestionComponent {

  constructor(private appartmentService: AppartmentsService, private appstore: AppstoreService) {}

  traveller: WritableSignal<Traveller> = this.appstore.traveller;
  userReservation: WritableSignal<Reservation> = this.appstore.userReservation;

  appartments: Appartment[] = [];
  filteredAppartments: Appartment[] = [];
  discount!: Discount;
  destroy$: Subject<void> = new Subject()

  ngOnInit(): void {
     this.getAppartment();
     console.log("userReservation",this.userReservation());
     
  }


  updateTravellerData(event: Reservation) :void {
    this.userReservation.set(event);
    console.log("userReservation", this.userReservation());
    
    const travellerCheckinDate = event.checkinDate?.getTime();
    const travellerCheckoutDate = event.checkoutDate?.getTime();
    // console.log("event",event);

    
    this.filteredAppartments = this.appartments.filter(appartment =>{
      const oneDay = 24 * 60 * 60 * 1000;

      if(travellerCheckinDate && travellerCheckoutDate) {
        for(let reservation of appartment.reservations) {
          if(reservation.checkinDate && reservation.checkoutDate &&travellerCheckinDate >= reservation.checkinDate.getTime() && travellerCheckinDate < reservation.checkoutDate.getTime()) {
            return false;
          }
        }

        let nextBusyDate: Date | null = null;
        for(let reservation of appartment.reservations) {
          if(reservation.checkinDate && reservation.checkinDate.getTime() > travellerCheckinDate) {
            nextBusyDate = reservation.checkinDate;

            if(travellerCheckoutDate >= nextBusyDate.getTime()){
              return false;
            }
            break;
          }
        }

      }
      
      return true;
    })
    
  }

  getAppartment():void {
    this.appartmentService.getActiveAppartments().pipe(takeUntil(this.destroy$)).subscribe(appartments => {
      this.appartments = appartments;
      this.filteredAppartments = appartments;
      console.log("appartments",appartments);
      
    })
  }


ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
}

}
