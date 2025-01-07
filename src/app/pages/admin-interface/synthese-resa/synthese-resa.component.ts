import { Component, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { AppstoreService } from '../../../shared/appstore.service';
import { AppartmentsService } from '../../../shared/appartments.service';
import { NotificationService } from '../../../shared/notification.service';
import { UtilisateurService } from '../../../shared/utilisateur.service';
import { Router } from '@angular/router';
import { User } from '../../../models/User.model';
import { Appartment } from '../../../models/Appartment.model';
import { Owner } from '../../../models/Owner.model';
import { take } from 'rxjs';
import { FormRechercheReservationComponent } from '../../../components/form-recherche-reservation/form-recherche-reservation.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReservationResearchRequest } from '../../../models/Request/ReservationResearchRequest.model';
import { Reservation } from '../../../models/Reservation.model';
import { LoginService } from '../../../shared/login.service';
import { BookingService } from '../../../shared/booking.service';
import { HistoriqueReservationCardComponent } from '../../../components/historique-reservation-card/historique-reservation-card.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-synthese-resa',
  standalone: true,
  imports: [FormRechercheReservationComponent, MatPaginatorModule, MatExpansionModule, MatTableModule, HistoriqueReservationCardComponent],
  templateUrl: './synthese-resa.component.html',
  styleUrl: './synthese-resa.component.scss'
})
export class SyntheseResaComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private readonly appstore: AppstoreService, 
    private readonly appartmentService: AppartmentsService, 
    private readonly notificationService: NotificationService, 
    private readonly utilisateurService: UtilisateurService,
    private readonly loginService: LoginService,
    private readonly reservationService: BookingService
  ){}

    currentUser: WritableSignal<User | null> = this.appstore.getCurrentUser()
    allAppartments: WritableSignal<Appartment[]> = this.appstore.getAllAppartments()
    reservations = signal<Reservation[]>([])
    owners: WritableSignal<Owner[]> = this.appstore.getOwners()

    displayedColumns: string[] = ['resa'];
    dataSource = new MatTableDataSource<Reservation>([]);

    ngOnInit(): void {
        this.getAppartments()
        this.getOwners()
    }

    initDataSource(): void {
      this.dataSource = new MatTableDataSource<Reservation>(
        this.reservations().sort((a, b) => new Date(b.checkinDate as Date).getTime() - new Date(a.checkinDate as Date).getTime())
      );
            this.dataSource.paginator = this.paginator;
    }

  getAppartments(): void {    
    if(this.allAppartments().length === 0) {
      if(this.currentUser()?.role === "ADMIN") {
        this.appartmentService.getAllAppartments().pipe(take(1)).subscribe(
          {
            error: () => this.loginService.logout().pipe(take(1)).subscribe()
          }
        )
      } else if (this.currentUser()?.role === "OWNER") {
        this.appartmentService.getAppartmentsByOwnerId(this.currentUser()?.id!).pipe(take(1)).subscribe(
          {
            error: () => this.loginService.logout().pipe(take(1)).subscribe()
          }
        )
      }
    }
  }

  getOwners(): void {
    if(this.currentUser()?.role === "ADMIN") {
      this.utilisateurService.getAllOwners().pipe(take(1)).subscribe()
    }
  }

  findReservationAppartment(appartmentId: number) : Appartment {
    return this.allAppartments().find(item => item.id === appartmentId)!
  }

  updateReservations(data: ReservationResearchRequest): void {
    this.reservationService.getReservationRequestsWithCriteria(data).pipe(take(1)).subscribe({
      next: (data) => {
        console.log("data", data);
        this.reservations.set(data)
        this.initDataSource()
      },
      error:() => this.notificationService.error("Une erreur est survenue, votre recherche n'a pas pu aboutir.")
    })
    
  }

}
