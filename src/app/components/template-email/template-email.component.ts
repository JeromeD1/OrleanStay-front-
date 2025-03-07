import { Component, OnInit, inject } from '@angular/core';
import { Traveller } from '../../models/Traveller.model';
import { Appartment } from '../../models/Appartment.model';
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';
import { SomeFunctionsService } from '../../shared/some-functions.service';
import { Reservation } from '../../models/Reservation.model';
import { AppstoreService } from '../../shared/appstore.service';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-email',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './template-email.component.html',
  styleUrl: './template-email.component.scss'
})
export class TemplateEmailComponent implements OnInit{
  traveller: Traveller = this.appstore.getTraveller()()
  reservation: Reservation = this.appstore.getUserReservation()()
  appartments: Appartment[] = this.appstore.getActiveAppartments()()
  appartment!: Appartment;
  imageRetour = '../../../../../assets/icons/icons8-flèche-gauche-gris.png';
  arrivalDate: string | undefined;
  departureDate: string | undefined;  

  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);

  constructor(
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

    const appartmentId: number = parseInt(this.route.snapshot.paramMap.get('appartmentId') as string);
    this.appartment = this.appartments.find(appartment => appartment.id === appartmentId) as Appartment;
  }

}
