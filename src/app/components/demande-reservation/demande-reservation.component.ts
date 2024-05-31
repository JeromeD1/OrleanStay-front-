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
  constructor(private someFunctionService: SomeFunctionsService, private appstore: AppstoreService) {}

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
  // reservation: Reservation = {
  //   id:0,
  //   appartment_id: 0,
  //   checkinDate: new Date(),
  //   checkoutDate: new Date(),
  //   nbAdult:0,
  //   nbChild:0,
  //   nbBaby:0,
  //   reservationPrice:0,
  //   isAccepted: false
  // };

  // travellerHasReservation!: TravellerHasReservation;

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
      // this.travelPrice = this.appartment.calculateReservationPrice(this.traveller.nbAdult, this.traveller.nbChild, this.traveller.checkinDate, this.traveller.checkoutDate,1)
      this.travelPrice = this.appartment.calculateReservationPrice(this.userReservation.nbAdult, this.userReservation.nbChild, this.userReservation.checkinDate, this.userReservation.checkoutDate)

    }
}


changeShowPickerarrival():void {
    this.showPickerarrival = !this.showPickerarrival;
}

changeShowPickerDeparture():void {
  this.showPickerDeparture = !this.showPickerDeparture;
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
    console.log('reservation', this.userReservation,"traveller", this.traveller);
    
    const clickedButton = (event.target as Element).getAttribute('data-button-id');
    
    if(this.demandeResaForm.valid && this.userReservation.checkinDate && this.userReservation.checkoutDate && this.travelPrice){

      if(clickedButton === "button-modele"){
        this.router.navigate(['/modeleEmail', this.appartment.id])
        
      } else if(clickedButton === 'button-envoiMail'){
        // this.reservation = {
        //   id:0,
        //   appartment_id: this.appartment.id,
        //   checkinDate: this.traveller.checkinDate,
        //   checkoutDate: this.traveller.checkoutDate,
        //   nbAdult:this.traveller.nbAdult,
        //   nbChild: this.traveller.nbChild,
        //   nbBaby: this.traveller.nbBaby,
        //   reservationPrice: this.travelPrice,
        //   accepted: false
        // }


        // this.travellerHasReservation = {
        //   traveller: this.traveller,
        //   reservation: this.reservation,
        //   appartmentDescription: this.appartment.description,
        //   numberNight: this.numberNight as number,
        //   accepted: false
        // };

        
        // this.bookingDataService.postTravellerReservation(this.travellerHasReservation);
        
        this.showPopup = true;
        this.appstore.resetUserReservation()
      }
    }
    
  }

}
