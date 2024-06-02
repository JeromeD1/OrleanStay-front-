import { Component, Input,Output ,EventEmitter, OnInit, ViewChild, inject } from '@angular/core';
import { Traveller } from '../../models/Traveller.model';
import { Appartment } from '../../models/Appartment.model';
import { SomeFunctionsService } from '../../shared/some-functions.service';
import { DateFromPicker } from '../../models/DateFromPicker.model';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Reservation } from '../../models/Reservation.model';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { AppstoreService } from '../../shared/appstore.service';
import { BookingService } from '../../shared/booking.service';
// import { TravellerHasReservation } from '../../../../../models/travellerHasReservation.model';
// import { BookingDataService


@Component({
  selector: 'app-demande-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePickerComponent],
  templateUrl: './demande-reservation.component.html',
  styleUrl: './demande-reservation.component.scss'
})
export class DemandeReservationComponent {
  router: Router = inject(Router);

  // constructor(private someFunctionService: SomeFunctionsService, private bookingDataService: BookingDataService) {}
  constructor(private someFunctionService: SomeFunctionsService, private appstore: AppstoreService, private bookingService: BookingService) {}

  @Input()
  traveller!: Traveller;

  @Input()
  userReservation!: Reservation

  @Input()
  appartments!: Appartment[];

  @Input()
  appartment!: Appartment;

  @Input()
  travelPrice! : number | null;

  @Output()
  showDemandeResa = new EventEmitter<Boolean>();

  @Output()
  travellerEmitter = new EventEmitter<Traveller>();

  @ViewChild('demandeResaForm', { static: false }) demandeResaForm!: NgForm;

  arrivalDate: string | undefined;
  departureDate: string | undefined;
  showPickerarrival: boolean = false;
  showPickerDeparture: boolean = false;
  showPopup: boolean = false;

  get numberNight(): number | null {
    return this.someFunctionService.getNumberOfDays(this.userReservation);
  };


ngOnInit(): void {
  console.log("userReservation in demande reservation onInit",this.userReservation);
  
    this.arrivalDate = this.someFunctionService.formatDate(this.userReservation.checkinDate, "arrive");
    this.departureDate = this.someFunctionService.formatDate(this.userReservation.checkoutDate, "depart");
}




handleChangeAppartment(appartmentName : String): void {
    this.appartment = this.appartments.find(appartment => appartment.name === appartmentName) as Appartment;
    if(this.userReservation.checkinDate && this.userReservation.checkoutDate && this.userReservation.nbAdult > 0){
      this.travelPrice = this.appartment.calculateReservationPrice(this.userReservation.nbAdult, this.userReservation.nbChild, this.userReservation.checkinDate, this.userReservation.checkoutDate)

    }
}


changeShowPickerarrival():void {
    this.showPickerarrival = !this.showPickerarrival;
}

changeShowPickerDeparture():void {
  this.showPickerDeparture = !this.showPickerDeparture;
}

closeAllPicker(): void {
  this.showPickerarrival = false;
  this.showPickerDeparture = false;
}

handleChangeCheckinOrCheckout(event: DateFromPicker): void {
  
  if(event.type === 'checkin') {
    this.userReservation.checkinDate = event.date;
    this.arrivalDate = this.someFunctionService.formatDate(this.userReservation.checkinDate, "arrive");
    this.changeShowPickerarrival();
  } else if(event.type === 'checkout') {
    this.userReservation.checkoutDate = event.date;
    this.departureDate = this.someFunctionService.formatDate(this.userReservation.checkoutDate, "depart");
    this.changeShowPickerDeparture();
  }

  if(this.userReservation.checkinDate && this.userReservation.checkoutDate){
    console.log("nbAdult",this.userReservation.nbAdult);
    
    this.travelPrice = this.appartment.calculateReservationPrice(this.userReservation.nbAdult, this.userReservation.nbChild, this.userReservation.checkinDate, this.userReservation.checkoutDate)

  }

}

  closeDemandeResa():void {
    this.showDemandeResa.emit(false);
  }


  onSubmit(event: Event):void {    
    const clickedButton = (event.target as Element).getAttribute('data-button-id');
    
    if(this.demandeResaForm.valid && this.userReservation.checkinDate && this.userReservation.checkoutDate && this.travelPrice){

      if(clickedButton === "button-modele"){
        this.router.navigate(['/templateEmail', this.appartment.id])
        
      } else if(clickedButton === 'button-envoiMail'){
        this.bookingService.postTravellerReservation(this.userReservation,this.traveller);
        
        this.showPopup = true;
        this.appstore.resetUserReservation()
      }
    }
    
  }

}
