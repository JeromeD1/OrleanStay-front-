import { Component, Input, EventEmitter, Output, ViewChild, ElementRef, HostListener, input, ChangeDetectionStrategy, output, signal, computed, effect } from '@angular/core';
import { TravellerNumbers } from '../../models/TravellerNumbers.model';
import { Reservation } from '../../models/Reservation.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


//-------------------------------------------------
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// DateAdapter est une classe abstraite qui sert de pont entre Angular Material et les opérations de date spécifiques 
//à l’implémentation. Cela signifie qu’elle permet à Angular Material de travailler avec différentes implémentations de date.

// MAT_DATE_FORMATS est un jeton d’injection qui vous permet de définir les formats de date que vous souhaitez utiliser 
//dans votre application.

// MAT_DATE_LOCALE est un jeton d’injection qui vous permet de définir la locale que vous souhaitez utiliser 
//dans votre application.
//--------------------------------------------------

import { MY_DATE_FORMAT } from '../../models/DateFormat.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChooseVoyagersComponent } from '../choose-voyagers/choose-voyagers.component';
import { TravellingChoiceSmallScreenComponent } from '../travelling-choice-small-screen/travelling-choice-small-screen.component';
import { AppstoreService } from '../../shared/appstore.service';

@Component({
  selector: 'app-travelling-choices',
  standalone: true,
  imports: [
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule, 
    CommonModule, 
    ChooseVoyagersComponent,
    TravellingChoiceSmallScreenComponent
  ],
  templateUrl: './travelling-choices.component.html',
  styleUrl: './travelling-choices.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  //-----------------------------------------
  providers: [
    {provide:MAT_DATE_LOCALE, useValue:'fr-FR'},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT}
    // dans les fournisseurs du composant, on fourni MY_DATE_FORMATS pour MAT_DATE_FORMATS et ‘fr-FR’ 
    //pour MAT_DATE_LOCALE. Cela signifie que partout où MAT_DATE_FORMATS et MAT_DATE_LOCALE sont utilisés dans le 
    //composant, ils utiliseront les valeurs fournies.
    //-------------------------------------------------
  ]
})
export class TravellingChoicesComponent {

  userReservation = input<Reservation>({
    checkinDate: null,
    checkoutDate: null,
    nbAdult: 0,
    nbBaby: 0,
    nbChild: 0
  })
  
  reservationChange = output<Reservation>()
  
  imgBalai = '../../../../../../assets/icons/icons8-balayer-gris.png';
  showChooseVoyager: boolean = false;
  isResearchAnimated: boolean = false;
  initialNumberOfPayingTravellers: number = 0;
  
  travellerNumbers = computed<TravellerNumbers>(() =>({
    numberAdult: this.userReservation().nbAdult,
    numberChild: this.userReservation().nbChild,
    numberBaby: this.userReservation().nbBaby
  }))  
  
  
  numberOfPayingTravellers = computed<number>(() => this.travellerNumbers().numberAdult + this.travellerNumbers().numberChild) 
  
  textTravellerNumber = computed<string>(() => {
    if(this.userReservation().nbBaby == 0){
      return   this.numberOfPayingTravellers() === 0 ? "Combien ?"
      : this.numberOfPayingTravellers() === 1 ? "1 voyageur" : this.numberOfPayingTravellers() + " voyageurs"
    } else if(this.userReservation().nbBaby == 1){
      return   this.numberOfPayingTravellers() === 0 ? "Combien ?"
      : this.numberOfPayingTravellers() === 1 ? `1 voyageur (+${this.userReservation().nbBaby} bébé)` : `${this.numberOfPayingTravellers()} voyageurs  (+${this.userReservation().nbBaby} bébé)`
    } else {
      return   this.numberOfPayingTravellers() === 0 ? "Combien ?"
      : this.numberOfPayingTravellers() === 1 ? `1 voyageur (+${this.userReservation().nbBaby} bébés)` : `${this.numberOfPayingTravellers()} voyageurs  (+${this.userReservation().nbBaby} bébés)`
    }
  
})  
  
  showTravellingChoiceSmallScreen: boolean = false;

  private _minCheckinDate: Date = new Date();
  private _maxCheckinDate: Date | null = null;
  private _minCheckoutDate: Date = new Date();
  private _maxCheckoutDate: Date | null = null;

  get minCheckinDate(): Date {
    return this._minCheckinDate;
  }

  get maxCheckinDate(): Date | null {
    return this._maxCheckinDate;
  }

  get minCheckoutDate(): Date | null {
    return this._minCheckoutDate;
  }

  get maxCheckoutDate(): Date | null {
    return this._maxCheckoutDate;
  }

  //--------------------------------------------------
  constructor(private adapter: DateAdapter<any>, private appstore: AppstoreService) {
    this.adapter.setLocale('fr');
    this._minCheckoutDate.setDate(this._minCheckoutDate.getDate() + 1)
  }
  // Dans le constructeur, on injecte DateAdapter et utilise sa méthode setLocale pour définir 
  //la locale à ‘fr’ (pour le français). Cela signifie que toutes les opérations de date effectuées par 
  //DateAdapter utiliseront désormais le format de date français.
  //-----------------------------------------------

/******Fonctions liées à la loupe et au lancement de la recherche ********/
/////La recherche s'active si les dates d'arrivées et de départ sont définies et se désactive lorsqu'elle est lancée/////
activateResearchButton(): void {  
  if(this.appstore.userReservation().checkinDate && this.appstore.userReservation().checkoutDate){
    this.isResearchAnimated = true
  } else {
    this.isResearchAnimated = false
  }
}

onStartResearch():void {
  this.reservationChange.emit(this.userReservation())
  this.isResearchAnimated = false
}


/****** Fonctions liées à la modification des dates d'entrée et de sortie, et du nombre de voyageur ******/
changeCheckin(date: Date): void {
  this.appstore.updateUserReservationKey<Date>("checkinDate", date)

  if(this.userReservation().checkinDate) {
    this._minCheckoutDate = new Date(date); // On crée une nouvelle instance de Date pour éviter 
    //la mutation de l'objet original c'est pour que _minCheckinDate et minCheckoutDate ne fassent pas référence à la même 
    //instance de Date
    this._minCheckoutDate.setDate(this._minCheckoutDate.getDate() + 1);
  } else {
    this._minCheckoutDate.setDate(this._minCheckoutDate.getDate() + 1)
  }

  this.activateResearchButton()
}

changeCheckout(date: Date): void {
  this.appstore.updateUserReservationKey<Date>("checkoutDate", date)
  if(this.userReservation().checkoutDate) {
    this._maxCheckinDate = new Date(date);
    this._maxCheckinDate.setDate(this._maxCheckinDate.getDate() - 1);
  } else {
    this._maxCheckinDate = null;
  }

  this.activateResearchButton()
}

deleteCheckinDateValue():void {
  this.appstore.updateUserReservationKey<null>("checkinDate", null);
  this.activateResearchButton()
}

deleteCheckoutDateValue():void {
  this.appstore.updateUserReservationKey<null>("checkoutDate", null);
  this.activateResearchButton()
}

updateTravellerNumbers(event: TravellerNumbers): void {
  this.appstore.updateUserReservationKey<number>("nbAdult", event.numberAdult)
  this.appstore.updateUserReservationKey<number>("nbChild", event.numberChild)
  this.appstore.updateUserReservationKey<number>("nbBaby", event.numberBaby)

  if(this.numberOfPayingTravellers() !== this.initialNumberOfPayingTravellers) {
    this.initialNumberOfPayingTravellers = this.numberOfPayingTravellers(); 
    }
}

deleteTravellers():void {
  this.appstore.resetUserReservationTravellers()
}
/***** */



setShowTravellingChoiceSmallScreen():void {
  this.showTravellingChoiceSmallScreen = ! this.showTravellingChoiceSmallScreen;
}

changeChooseVoyager():void {
  this.showChooseVoyager = !this.showChooseVoyager;
  
}


onReceiveTravellerChangeFromSmallScreenTravellerChoice(event: Reservation) {
  this.reservationChange.emit(event);
}

}
