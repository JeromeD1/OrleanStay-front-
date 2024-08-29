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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistiques-resa',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './statistiques-resa.component.html',
  styleUrl: './statistiques-resa.component.scss'
})
export class StatistiquesResaComponent implements OnInit {

  closeEmitter = output<void>()

  ownerAppartments: WritableSignal<Appartment[]> = this.appstore.getAllAppartments()
  currentUser: User | null = this.appstore.getCurrentUser()()
  now = new Date()
  selectedYear = signal<number>(this.now.getFullYear())
  months: string[] = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"]
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

  clickMe(): void {
    console.log("yearOptions", this.yearOptions());
    console.log("ownerAppartStatistics", this.ownerAppartStatistics());
    
    
  }

  closeStatistics(): void {
    this.closeEmitter.emit()
  }

}
