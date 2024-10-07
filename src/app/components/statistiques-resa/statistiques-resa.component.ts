import { Component, computed, OnInit, output, signal, WritableSignal } from '@angular/core';
import { AppartmentsService } from '../../shared/appartments.service';
import { AppstoreService } from '../../shared/appstore.service';
import { SomeFunctionsService } from '../../shared/some-functions.service';
import { Appartment } from '../../models/Appartment.model';
import { User } from '../../models/User.model';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AppartmentBusinessStat } from '../../models/AppartmentBusinessStat.model';
import { MatTableModule } from '@angular/material/table';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarA11y, CalendarDateFormatter, CalendarEvent, CalendarEventTitleFormatter, CalendarModule, CalendarUtils, CalendarView, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CALENDAR_COLORS } from '../../shared/constantes/calendar-colors';
import { MyCalendarEvent } from '../../models/MyCalendarEvents.model';
import { addMonths, subMonths, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import localeFr from '@angular/common/locales/fr';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';

registerLocaleData(localeFr);

@Component({
  selector: 'app-statistiques-resa',
  standalone: true,
  imports: [CommonModule, MatTableModule, CalendarModule, DatePipe, MatSelectModule, MatFormFieldModule, MatOptionModule],
  providers: [
    { provide: DateAdapter, useFactory: adapterFactory },
    CalendarUtils,
    CalendarA11y,
    CalendarDateFormatter,
    CalendarEventTitleFormatter
  ],
  templateUrl: './statistiques-resa.component.html',
  styleUrl: './statistiques-resa.component.scss'
})
export class StatistiquesResaComponent implements OnInit {

  closeEmitter = output<void>()

  ownerAppartments: WritableSignal<Appartment[]> = this.appstore.getAllAppartments()
  currentUser: User | null = this.appstore.getCurrentUser()()
  now = new Date()
  selectedYear = signal<number>(this.now.getFullYear())
  months: string[] = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"]
  // yearOptionsLength = this.now.getFullYear() - 2020
  // yearOptions = Array.from({ length: this.yearOptionsLength }, (_, i) => 2020 + i);
  ownerAppartStatistics = computed<AppartmentBusinessStat[]>(() => this.ownerAppartments().map(appart => appart.calculateBusinessStatistics()))
  yearOptions = computed(() => {
    const allYears: string[] = []
    this.ownerAppartStatistics().forEach(stat => {
      const years = stat.yearStatistics.map(item => item.year)
      years.forEach(year =>{
        allYears.push(year.toString())
      })
    })
    console.log("this.ownerAppartments()", this.ownerAppartments());
    
    return new Set(allYears.sort((a,b) => Number(a) - Number(b)))
  })

  constructor(
    private readonly appartmentService: AppartmentsService,
    private readonly appstore: AppstoreService,
    private readonly router: Router,
    private readonly someFunctions: SomeFunctionsService){}


    ngOnInit(): void {
        this.getOwnerAppartments()
    }

  getOwnerAppartments(): void {
    if(this.ownerAppartments().length === 0){
      if(this.currentUser && this.currentUser.role !== "USER") {   
        this.appartmentService.getAppartmentsByOwnerId(this.currentUser?.id).pipe(take(1)).subscribe()
      } else {
        this.router.navigate(["/"])
      }
    }
  }

  getMonthlyEarns(row: AppartmentBusinessStat, monthIndex: number): number {
    const yearStat = row.yearStatistics.find(item => item.year == this.selectedYear())
    return yearStat ? yearStat.monthlyEarns[monthIndex] : 0
  }

  getYearTotal(row: AppartmentBusinessStat): number {
    const yearStat = row.yearStatistics.find(item => item.year == this.selectedYear())
    return yearStat ? yearStat.yearTotal : 0
  }

  getMonthlyTotal(monthIndex: number): number {
    return this.ownerAppartStatistics().reduce((total, row) => {
      const yearStat = row.yearStatistics.find(item => item.year == this.selectedYear());
      return total + (yearStat ? yearStat.monthlyEarns[monthIndex] : 0)
    }, 0)
  }

  getYearTotalForAll(): number {
    return this.ownerAppartStatistics().reduce((total, row) => {
      return total + this.getYearTotal(row)
    }, 0)
  }


  handleChangeYear(year: string) {
    this.selectedYear.set(Number(year))
  }

  clickMe(): void {
    console.log("yearOptions", this.yearOptions());
    console.log("ownerAppartStatistics", this.ownerAppartStatistics());
    
    
  }

  closeStatistics(): void {
    this.closeEmitter.emit()
  }

  /**********Test angular calendar */
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events = computed<MyCalendarEvent[]>(() => {
    const allEvents: MyCalendarEvent[] = []
    this.ownerAppartments().forEach((appart, index) => {
      appart.reservations.forEach(resa => {
        if(!resa.cancelled) {
          const event: MyCalendarEvent = {
            start: resa.checkinDate!,
            end: resa.checkoutDate!,
            title: resa.traveller?.personalInformations.lastname!,
            color: CALENDAR_COLORS[index],
            border: !resa.accepted
          }

          allEvents.push(event)
        }
      })
    })

    return allEvents
  })

  getAppartLegendColor(appartIndex: number) {
    return CALENDAR_COLORS[appartIndex].secondary
  }
  
  previousMonth(): void {
    this.viewDate = subMonths(this.viewDate, 1);
  }

  nextMonth(): void {
    this.viewDate = addMonths(this.viewDate, 1);
  }

  getPreviousMonthName(): string {
    return this.capitalizeFirstLetter(format(subMonths(this.viewDate, 1), 'MMMM', { locale: fr }))
  }

  getNextMonthName(): string {
    return this.capitalizeFirstLetter(format(addMonths(this.viewDate, 1), 'MMMM', { locale: fr }))
  }

  getCurrentMonthName(): string {
    return this.capitalizeFirstLetter(format(this.viewDate, 'MMMM', { locale: fr }))
  }

  getCurrentYear(): string {
    return format(this.viewDate, "yyyy")
  }

  getDayName(date: Date): string {
    return format(date, 'EEEE', { locale: fr });
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  isMiddleDay(date: Date, event: CalendarEvent): boolean {
    return date > event.start && date < event.end!;
  }

  getComplementaryColor(hex: string): string {
    // Vérifie si le code hexadécimal commence par #
    if (hex.startsWith('#')) {
      hex = hex.slice(1);
    }
  
    // Convertit le code hexadécimal en nombre entier
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
  
    // Calcule la couleur complémentaire
    const compR = (255 - r).toString(16).padStart(2, '0');
    const compG = (255 - g).toString(16).padStart(2, '0');
    const compB = (255 - b).toString(16).padStart(2, '0');
  
    // Retourne la couleur complémentaire en format hexadécimal
    return `#${compR}${compG}${compB}`;
  }

}
