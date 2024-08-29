import { Component, computed, OnInit, output, signal, WritableSignal } from '@angular/core';
import { AppartmentsService } from '../../shared/appartments.service';
import { AppstoreService } from '../../shared/appstore.service';
import { SomeFunctionsService } from '../../shared/some-functions.service';
import { Appartment } from '../../models/Appartment.model';
import { User } from '../../models/User.model';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AppartmentBusinessStat } from '../../models/AppartmentBusinessStat.model';

@Component({
  selector: 'app-statistiques-resa',
  standalone: true,
  imports: [],
  templateUrl: './statistiques-resa.component.html',
  styleUrl: './statistiques-resa.component.scss'
})
export class StatistiquesResaComponent implements OnInit {

  closeEmitter = output<void>()

  ownerAppartments: WritableSignal<Appartment[]> = this.appstore.getAllAppartments()
  currentUser: User | null = this.appstore.getCurrentUser()()
  now = new Date()
  selectedYear = signal<number>(this.now.getFullYear())
  // yearOptionsLength = this.now.getFullYear() - 2020
  // yearOptions = Array.from({ length: this.yearOptionsLength }, (_, i) => 2020 + i);
  ownerAppartStatistics = computed<AppartmentBusinessStat[]>(() => this.ownerAppartments().map(appart => appart.calculateBusinessStatistics()))
  yearOptions = computed(() => {
    const allYears: number[] = []
    this.ownerAppartStatistics().forEach(stat => {
      const years = stat.yearStatistics.map(item => item.year)
      years.forEach(year =>{
        allYears.push(year)
      })
    })

    return new Set(allYears.sort((a,b) => a - b))
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

  clickMe(): void {
    console.log("yearOptions", this.yearOptions());
    console.log("ownerAppartStatistics", this.ownerAppartStatistics());
    
    
  }

  closeStatistics(): void {
    this.closeEmitter.emit()
  }

}
