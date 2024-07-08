import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCalendarCellClassFunction, MatDatepickerModule, MatCalendar, MatDatepicker } from '@angular/material/datepicker';
import { Reservation } from '../../models/Reservation.model';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MY_DATE_FORMAT } from '../../models/DateFormat.model';


@Component({
  selector: 'app-simple-calendar',
  standalone: true,
  imports: [MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatCalendar, MatDatepicker],
  templateUrl: './simple-calendar.component.html',
  styleUrl: './simple-calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {provide:MAT_DATE_LOCALE, useValue:'fr-FR'},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT},
    MatNativeDateModule
    // dans les fournisseurs du composant, on fourni MY_DATE_FORMATS pour MAT_DATE_FORMATS et ‘fr-FR’ 
    //pour MAT_DATE_LOCALE. Cela signifie que partout où MAT_DATE_FORMATS et MAT_DATE_LOCALE sont utilisés dans le 
    //composant, ils utiliseront les valeurs fournies.
    //-------------------------------------------------
  ]
})
export class SimpleCalendarComponent {

  reservations = input.required<Reservation[]>()
  selectedReservation = input<Reservation>()
  selectedDate: null = null;



 

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {

    if (view === 'month') {
      const time = cellDate.getTime() + 3600 * 24 * 1000 // ajout de 1 jour car les dates étaient décalées dans le calendrier par rapport aux dates reelles (pourquoi ?)

      for(let reservation of this.reservations()) {
          if(reservation.accepted && time >= reservation.checkinDate!.getTime() && time < reservation.checkoutDate!.getTime()){
              return 'highlight-red';
          } else if(!reservation.cancelled && time >= reservation.checkinDate!.getTime() && time < reservation.checkoutDate!.getTime()){
            if(this.selectedReservation() && reservation.checkinDate?.getTime() === this.selectedReservation()?.checkinDate?.getTime() && reservation.checkoutDate?.getTime() === this.selectedReservation()?.checkoutDate?.getTime()){
              return 'highlight-blue'
            }  
            
            return 'highlight-yellow'
          }
      }
  }
    return "";
}



}
