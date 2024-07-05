import { Component, OnDestroy, OnInit, WritableSignal, computed, signal } from '@angular/core';
import { AppartmentsService } from '../../../shared/appartments.service';
import { AppstoreService } from '../../../shared/appstore.service';
import { Subject, takeUntil } from 'rxjs';
import { Appartment } from '../../../models/Appartment.model';
import { Reservation } from '../../../models/Reservation.model';
import { BookingService } from '../../../shared/booking.service';
import { User } from '../../../models/User.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { AppartmentNameAndOwner } from '../../../models/AppartmentNameAndOwner.model';

@Component({
  selector: 'app-accept-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSelectModule],
  templateUrl: './accept-reservation.component.html',
  styleUrl: './accept-reservation.component.scss'
})
export class AcceptReservationComponent implements OnInit, OnDestroy {
  
  constructor(private appartmentService: AppartmentsService, private appStore:AppstoreService, private bookingService: BookingService) {}

  destroy$: Subject<void> = new Subject()
  currentUser: User | null = this.appStore.getCurrentUser()()
  userRole = this.currentUser?.role
  appartmentNames: WritableSignal<AppartmentNameAndOwner[]> = this.appStore.getAppartmentNames()
  appartmentOfReservation = signal<Appartment | null>(null)
  reservationRequests: WritableSignal<Reservation[]> = this.appStore.getReservationRequests()
  filter = signal<"all" | "new" | "waitingForDeposit" | "waitingForValidation">("all")
  
  filteredReservationRequests = computed(() => {
    if(this.filter() === "all"){
      return this.reservationRequests()
    } else if(this.filter() === "new"){
      return this.reservationRequests().filter(request => request.depositAsked === false && request.depositReceived === false)
    } else if (this.filter() === "waitingForDeposit") {
      return this.reservationRequests().filter(request => request.depositAsked === true)
    } else {
      return this.reservationRequests().filter(request => request.depositReceived === true)
    }
  })

  selectedReservation: Reservation = this.filteredReservationRequests()[0]


  ngOnInit(): void {
      this.getReservationRequests()
      this.getAppartmentNames()
  }

  /***************Récupération des datas en bdd ****************************/
  getReservationRequests(): void {
    if(this.reservationRequests().length === 0){
      if(this.userRole === "ADMIN") {
        this.bookingService.getAllReservationRequests().pipe(takeUntil(this.destroy$)).subscribe()
      } else if(this.currentUser && this.userRole === "OWNER") {
        this.bookingService.getReservationRequestsByOwnerId(this.currentUser?.id).pipe(takeUntil(this.destroy$)).subscribe()
      }
    }
  }

  getAppartmentNames(): void {
    if(this.appartmentNames().length === 0) {
      this.appartmentService.getAppartmentNamesAndOwners().pipe(takeUntil(this.destroy$)).subscribe()
    }
  }

  getAppartmentsById(id: number): void {
    this.appartmentService.getAppartmentById(id).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (data) => {this.appartmentOfReservation.set(data)}
      } 
    )
  }

  /******Reservation filter functions **************************/
    setFilterToAll(): void {
      this.filter.set("all")
    }

    setFilterToNew(): void {
      this.filter.set("new")
    }

    setFilterToWaitingForDeposit(): void {
      this.filter.set("waitingForDeposit")
    }

    setFilterToWaitingForValidation(): void {
      this.filter.set("waitingForValidation")
    }


  /*******************Choix de la réservation ************/
  handleChangeReservation(reservation: Reservation) {
    this.selectedReservation = reservation
  }
  /************* Fonction pour trouver un nom d'appartement en fonction de son id ***************/
  findAppartmentNameById(id: number): string | undefined {
    return this.appartmentNames().find(appartment => appartment.id == id)?.name
  }

  ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
  }
}
