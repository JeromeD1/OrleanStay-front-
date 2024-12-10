import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectionStrategy, ViewChild, AfterViewInit, output } from '@angular/core';
import { Reservation } from '../../models/Reservation.model';
import { MatCalendarCellClassFunction, MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateFromPicker } from '../../models/DateFromPicker.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SomeFunctionsService } from '../../shared/some-functions.service';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class DatePickerComponent implements OnInit, AfterViewInit{
  @Input()
  initDateValue!: Date | null;

  @Input()
  importedCheckinDate : Date | null = null;

  @Input()
  importedCheckoutDate : Date | null = null;

  @Input()
  importedReservations: Reservation[] = [];
  

  @Input()
  dateType!: 'checkin' | 'checkout';

  @Input()
  whoIsWatching: "user" | "admin" = "user"

  @Output()
  dateEmitter = new EventEmitter<DateFromPicker>();

  closeEmitter = output<boolean>()



private _pickerDateValue: Date | null = null;
private _minCheckinDate: Date = new Date();
private _maxCheckinDate: Date | null = null;
private _minCheckoutDate: Date = new Date();
private _maxCheckoutDate: Date | null = null;

constructor(private readonly someFunctions: SomeFunctionsService){}


ngOnInit(): void {
    if(this.initDateValue) {      
      this._pickerDateValue = this.initDateValue;
      if(this.dateType === 'checkin') {        
        this.setMaxCheckinDate();
      } else {        
        this.setMinCheckoutDate();  
      }
    } else if(this.dateType === 'checkout'){
      this._minCheckoutDate.setDate(this._minCheckoutDate.getDate() + 1);
    }
    
}

/*********Ouverture du date picker à l'initialisation du composant */
@ViewChild('checkDate') datepicker!: MatDatepicker<Date>;

ngAfterViewInit() {
  this.datepicker.open();
}
/********** ***************************************************/



get pickerDateValue(): Date | null {
  return this._pickerDateValue;
}

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


set pickerDateValue(date: Date) {
  this._pickerDateValue = date;
  if(this.dateType === "checkin"){
    if(this._pickerDateValue) {
      this._minCheckoutDate = new Date(date); // On crée une nouvelle instance de Date pour éviter 
      //la mutation de l'objet original c'est pour que _minCheckinDate et minCheckoutDate ne fassent pas référence à la même 
      //instance de Date
      this._minCheckoutDate.setDate(this._minCheckoutDate.getDate() + 1);
    } else {
      this._minCheckoutDate.setDate(this._minCheckoutDate.getDate() + 1);
    }
  } else {
    if(this._pickerDateValue) {
      this._maxCheckinDate = new Date(date);
      this._maxCheckinDate.setDate(this._maxCheckinDate.getDate() - 1);
    } else {
      this._maxCheckinDate = null;
    }
  }
}


setMaxCheckinDate(): void {
  if(this.importedCheckoutDate) {
    this._maxCheckinDate = new Date(this.importedCheckoutDate);
    this._maxCheckinDate.setDate(this._maxCheckinDate.getDate() - 1);
  } else {
    this._maxCheckinDate = null;
  }
}


setMinCheckoutDate(): void {
  console.log("this.importedCheckinDate", this.importedCheckinDate);
  
  if(this.importedCheckinDate) {
    console.log("test");
    
    this._minCheckoutDate = new Date(this.importedCheckinDate); // On crée une nouvelle instance de Date pour éviter 
    console.log(this._minCheckoutDate);
    
    //la mutation de l'objet original c'est pour que _minCheckinDate et minCheckoutDate ne fassent pas référence à la même 
    //instance de Date
    this._minCheckoutDate.setDate(this._minCheckoutDate.getDate() + 1);
  } else {
    this._minCheckoutDate.setDate(this._minCheckoutDate.getDate() + 1);
  }
}


filterBookedDates = (date: Date | null): boolean => {
    
  let time = date?.getTime() || 0;
  if(time !== 0) {time+=  3600 * 24 * 1000} // ajout de 1 jour car les dates étaient décalées dans le calendrier par rapport aux dates reelles (pourquoi ?)


  //désactiver les dates déjà réservées
    for(let reservation of this.importedReservations) {
      if(time >= reservation.checkinDate!.getTime() && time < reservation.checkoutDate!.getTime()){
        return false;
      }
    }

    
    //si dateType = checkin et que importedCheckout est non null alors on bloque les dates avant le précédant checkout des réservations
    if(this.dateType === "checkin" && this.importedCheckoutDate){
    const sortedUpReservations = this.importedReservations.sort((a, b) => a.checkoutDate!.getTime() - b.checkoutDate!.getTime())

    const closestCheckoutDate = sortedUpReservations
    .filter(reservation => reservation.checkoutDate!.getTime() < this.importedCheckoutDate!.getTime())
    .reduce((closest, current) => {
      const closestDate = closest.checkoutDate
      const currentDate = current.checkoutDate
      return closestDate!.getTime() > currentDate!.getTime() ? closest : current;
    }, sortedUpReservations[0]).checkoutDate

    if(time < closestCheckoutDate!.getTime() || time >= this.importedCheckoutDate.getTime()){
      return false;
    }
    
     if(closestCheckoutDate && time < closestCheckoutDate!.getTime() || time >= this.importedCheckoutDate.getTime()){
      return false;
    }
  }

  //si dateType = checkout et que importedCheckin est non null alors on bloque les dates après le prochain checkin des réservations  
  if(this.dateType === "checkout" && this.importedCheckinDate){
    const sortedReservations = this.importedReservations.sort((a, b) => a.checkoutDate!.getTime() - b.checkoutDate!.getTime())

    const closestNextCheckinDate = sortedReservations.filter(reservation => reservation.checkinDate!.getTime() > this.importedCheckinDate!.getTime())[0]?.checkinDate
    
    if(closestNextCheckinDate && time > closestNextCheckinDate.getTime() || time <= this.importedCheckinDate.getTime()){
      return false
    }
  }
  return true;
}




dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
  if (view === 'month') {
    const time = cellDate.getTime() + 3600 * 24 * 1000 // ajout de 1 jour car les dates étaient décalées dans le calendrier par rapport aux dates reelles (pourquoi ?)

    for(let reservation of this.importedReservations) {
        if(time >= reservation.checkinDate!.getTime() && time < reservation.checkoutDate!.getTime()){
            if(this.whoIsWatching === "user"){
              return 'highlight-date-accepted';
            }else {
              if(reservation.accepted){
                return 'highlight-date-accepted';
              } else {
                return 'highlight-date-not-accepted';
              }
            }
        }
    }
}

  return "";
}




emitNewDate(event : MatDatepickerInputEvent<Date>):void {
  const dateFromPicker: DateFromPicker = {
    date: event.value as Date,
    type: this.dateType
  }
  
  this.dateEmitter.emit(dateFromPicker);
  
}

leaveWithoutEmitNewDate(event: Event): void {  
  if(this.initDateValue){    
    this.closeEmitter.emit(false)
  }
}

}
