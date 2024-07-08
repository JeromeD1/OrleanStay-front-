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
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppartmentNameAndOwner } from '../../../models/AppartmentNameAndOwner.model';
import { SomeFunctionsService } from '../../../shared/some-functions.service';
import { NotificationService } from '../../../shared/notification.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { SimpleCalendarComponent } from '../../../components/simple-calendar/simple-calendar.component';

@Component({
  selector: 'app-accept-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSelectModule, MatFormFieldModule, MatOptionModule, MatSnackBarModule, SimpleCalendarComponent],
  templateUrl: './accept-reservation.component.html',
  styleUrl: './accept-reservation.component.scss'
})
export class AcceptReservationComponent implements OnInit, OnDestroy {
  
  constructor(private appartmentService: AppartmentsService, private appStore:AppstoreService, private bookingService: BookingService, public someFunctions: SomeFunctionsService, private notificationService: NotificationService) {}

  destroy$: Subject<void> = new Subject()
  currentUser: User | null = this.appStore.getCurrentUser()()
  userRole = this.currentUser?.role
  appartmentNames: WritableSignal<AppartmentNameAndOwner[]> = this.appStore.getAppartmentNames()
  appartmentOfReservation: WritableSignal<Appartment | null> = this.appStore.getCurrentUsedAppartment()
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

  selectedReservation = signal<Reservation>(this.filteredReservationRequests()[0])


  ngOnInit(): void {
      this.getReservationRequests()
      this.getAppartmentNames()
  }

  /***************Récupération des datas en bdd ****************************/
  getReservationRequests(): void {
    // if(this.reservationRequests().length === 0){
      if(this.userRole === "ADMIN") {
        this.bookingService.getAllReservationRequests().pipe(takeUntil(this.destroy$)).subscribe(
          {
            next: () => {
              this.selectedReservation.set(this.filteredReservationRequests()[0])
              this.getAppartmentsById(this.selectedReservation().appartmentId!)
            }
          }
        )
        
      } else if(this.currentUser && this.userRole === "OWNER") {
        this.bookingService.getReservationRequestsByOwnerId(this.currentUser?.id).pipe(takeUntil(this.destroy$)).subscribe(
          {
            next: () => this.selectedReservation.set(this.filteredReservationRequests()[0])
          }
        )
      }
    // }
  }

  getAppartmentNames(): void {
      this.appartmentService.getAppartmentNamesAndOwners().pipe(takeUntil(this.destroy$)).subscribe()
  }

  getAppartmentsById(id: number): void {
    this.appartmentService.getAppartmentById(id).pipe(takeUntil(this.destroy$)).subscribe()
  }

  /******Reservation filter functions **************************/
    setFilterToAll(): void {
      this.filter.set("all")
      this.selectedReservation.set(this.filteredReservationRequests()[0])
    }

    setFilterToNew(): void {
      this.filter.set("new")
      this.selectedReservation.set(this.filteredReservationRequests()[0])

    }

    setFilterToWaitingForDeposit(): void {
      this.filter.set("waitingForDeposit")
      this.selectedReservation.set(this.filteredReservationRequests()[0])

    }

    setFilterToWaitingForValidation(): void {
      this.filter.set("waitingForValidation")
      this.selectedReservation.set(this.filteredReservationRequests()[0])
    }


  /*******************Choix de la réservation ************/
  handleChangeReservation(reservation: Reservation) {
    this.selectedReservation.set(reservation) 
    this.getAppartmentsById(this.selectedReservation().appartmentId!)   
  }
  /************* Fonction pour trouver un nom d'appartement en fonction de son id ***************/
  findAppartmentNameById(id: number): string | undefined {
    return this.appartmentNames().find(appartment => appartment.id == id)?.name
  }

  /***********Modif du montant des arrhes ***********/
  setDepositValue(value: number | undefined) { // TODO: VERIFIER SI FACULTATIF
    if(value) {
      this.selectedReservation.update(resa => ({...resa, depositValue: value}))
    }
  
  }

  /************Fonctions de validation **********/
  handleAskForDeposit(): void {
    this.selectedReservation.update((value) => ({...value, depositAsked: true}))
    this.bookingService.askForDeposit(this.selectedReservation()).subscribe(
      {
        next: (data) => {
          //message acceptation
          this.selectedReservation.set(this.filteredReservationRequests()[0])
          this.notificationService.success("Votre demande de paiement d'ahrres a bien été envoyé")
        },
        error: (error) => {
          //message error
          this.notificationService.error(error)
        }
      }
    )
  }

  handleRejectReservation(): void {
    this.selectedReservation.update(value => ({...value, cancelled: true}))

    this.bookingService.rejectReservation(this.selectedReservation()).subscribe(
      {
        next: () => {
          //message acceptation
          this.selectedReservation.set(this.filteredReservationRequests()[0])
          this.notificationService.success("La demande de réservation a bien été rejetée (statut annulé)")
        },
        error: (error) => {
          //message error
          this.notificationService.error(error)
        }
      }
    )
  }

  handleAcceptReservation(): void {
    this.selectedReservation.update(value => ({...value, accepted: true}))

    this.bookingService.rejectReservation(this.selectedReservation()).subscribe(
      {
        next: () => {
          //message acceptation
          this.selectedReservation.set(this.filteredReservationRequests()[0])
          this.notificationService.success("La demande de réservation a bien été acceptée.")
        },
        error: (error) => {
          //message error
          this.notificationService.error(error)
        }
      }
    )
  }

  onError() {
    this.notificationService.error("Ceci est une erreur")
  }

  onSuccess() {
    this.notificationService.success("ceci est un success")
  }

  ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
  }
}
