import { Component, output, input } from '@angular/core';
import { Appartment } from '../../models/Appartment.model';
import { MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-toutes-les-dispo',
  standalone: true,
  imports: [MatDatepickerModule],
  templateUrl: './toutes-les-dispo.component.html',
  styleUrl: './toutes-les-dispo.component.scss'
})
export class ToutesLesDispoComponent {

  appartment = input.required<Appartment>()
  showToutesDispo = output<boolean>()

  selectedDate: null = null;


  closeToutesDispo(): void {
    this.showToutesDispo.emit(false);
  }

  filterBookedDates = (date: Date | null): boolean => {    
    let time = date?.getTime() || 0;
    if(time !== 0) {time+=  3600 * 24 * 1000} // ajout de 1 jour car les dates étaient décalées dans le calendrier car set à 12h

      for(let reservation of this.appartment().reservations) {        
        if(time >= reservation.checkinDate!.getTime() && time < reservation.checkoutDate!.getTime()){
          return false;
        }
      }

    return true;
  }


 

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {

    if (view === 'month') {
      const time = cellDate.getTime() + 3600 * 24 * 1000;

      for(let reservation of this.appartment().reservations) {
          if(time >= reservation.checkinDate!.getTime() && time < reservation.checkoutDate!.getTime()){
              return 'highlight-date';
          }
      }
  }
    return "";
}

}
