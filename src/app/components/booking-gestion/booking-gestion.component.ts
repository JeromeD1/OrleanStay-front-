import { Component, OnInit, OnDestroy, WritableSignal, signal, effect } from '@angular/core'
import { Traveller } from '../../models/Traveller.model'
import { AppartmentsService } from '../../shared/appartments.service'
import { Appartment } from '../../models/Appartment.model'
import { Subject, takeUntil } from 'rxjs'
import { Reservation } from '../../models/Reservation.model'
import { AppstoreService } from '../../shared/appstore.service'
import { CommonModule } from '@angular/common'
import { AppartmentCardComponent } from '../appartment-card/appartment-card.component'
import { TravellingChoicesComponent } from '../travelling-choices/travelling-choices.component'


@Component({
  selector: 'app-booking-gestion',
  standalone: true,
  imports: [
    CommonModule,
    AppartmentCardComponent,
    TravellingChoicesComponent,
    AppartmentCardComponent
  ],
  templateUrl: './booking-gestion.component.html',
  styleUrl: './booking-gestion.component.scss'
})
export class BookingGestionComponent implements OnInit, OnDestroy{

  constructor(private appartmentService: AppartmentsService, private appstore: AppstoreService) {
    effect(() => {
      this.filteredAppartments = this.appartments()
    })
  }

  traveller: WritableSignal<Traveller> = this.appstore.traveller
  userReservation: WritableSignal<Reservation> = this.appstore.userReservation

  appartments: WritableSignal<Appartment[]> = this.appstore.activeAppartments
  filteredAppartments :Appartment[] = []
  destroy$: Subject<void> = new Subject()

  ngOnInit(): void {
    if(this.appartments().length === 0){
      this.getAppartment()
      console.log("userReservation",this.userReservation())
    }
     
  }


  updateTravellerData(event: Reservation) :void {
    this.userReservation.set(event)
    
    const travellerCheckinDate = event.checkinDate?.getTime()
    const travellerCheckoutDate = event.checkoutDate?.getTime()
    
    this.filteredAppartments = this.appartments().filter(appartment =>{
      if(travellerCheckinDate && travellerCheckoutDate) {
        for(let reservation of appartment.reservations) {
          if(reservation.checkinDate && reservation.checkoutDate &&travellerCheckinDate >= reservation.checkinDate.getTime() && travellerCheckinDate < reservation.checkoutDate.getTime()) {
            return false
          }
        }

        let nextBusyDate: Date | null = null
        for(let reservation of appartment.reservations) {
          if(reservation.checkinDate && reservation.checkinDate.getTime() > travellerCheckinDate) {
            nextBusyDate = reservation.checkinDate

            if(travellerCheckoutDate >= nextBusyDate.getTime()){
              return false
            }
            break
          }
        }

      }
      
      return true
    })
    
  }

  getAppartment():void {
    this.appartmentService.getActiveAppartments().pipe(takeUntil(this.destroy$)).subscribe()
  }


ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
}

}
