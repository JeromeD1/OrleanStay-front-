import { Component, OnDestroy, OnInit, inject } from '@angular/core';
// import { BookingDataService
import { Traveller } from '../../models/Traveller.model';
import { Appartment } from '../../models/Appartment.model';
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';
import { AppartmentsService } from '../../shared/appartments.service';
import { SomeFunctionsService } from '../../shared/some-functions.service';
import { Reservation } from '../../models/Reservation.model';
import { AppstoreService } from '../../shared/appstore.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-email',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './template-email.component.html',
  styleUrl: './template-email.component.scss'
})
export class TemplateEmailComponent {
  traveller: Traveller = this.appstore.traveller()
  reservation: Reservation = this.appstore.userReservation()
  appartments: Appartment[] = this.appstore.activeAppartments()
  appartment!: Appartment;
  imageRetour = '../../../../../assets/icons/icons8-flèche-gauche-gris.png';
  arrivalDate: string | undefined;
  departureDate: string | undefined;  

  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  destroy$: Subject<void> = new Subject()

  constructor(
    // private bookingDataService: BookingDataService, 
    private appartmentService: AppartmentsService, 
    private someFunctionService: SomeFunctionsService,
    private appstore: AppstoreService
    ) {

  }

  ngOnInit(): void {
      this.getAppartment();
      this.arrivalDate = this.someFunctionService.formatDate(this.reservation.checkinDate, "arrive");
      this.departureDate = this.someFunctionService.formatDate(this.reservation.checkoutDate, "depart");
  }

  get numberNight(): number | null {
    return this.someFunctionService.getNumberOfDays(this.reservation);
  };

  get travelPrice(): number | null {
    if(this.reservation.nbAdult > 0 && this.reservation.checkinDate && this.reservation.checkoutDate) {

      return this.appartment.calculateReservationPrice(this.reservation.nbAdult, this.reservation.nbChild, this.reservation.checkinDate, this.reservation.checkoutDate);
    } else {
      return null;
    }
  }


  getAppartment(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params: ParamMap) => {
        const appartmentId: number = parseInt(params.get('appartmentId') as string);
   
        this.appartment = this.appartments.find(appartment => appartment.id === appartmentId) as Appartment;
            

    })
  }



  ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
  }
}
