import { Component, OnInit, signal, WritableSignal } from '@angular/core';
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

@Component({
  selector: 'app-synthese-resa',
  standalone: true,
  imports: [FormRechercheReservationComponent, MatExpansionModule],
  templateUrl: './synthese-resa.component.html',
  styleUrl: './synthese-resa.component.scss'
})
export class SyntheseResaComponent implements OnInit {

  constructor(
    private readonly appstore: AppstoreService, 
    private readonly appartmentService: AppartmentsService, 
    private readonly notificationService: NotificationService, 
    private readonly utilisateurService: UtilisateurService,
    private readonly loginService: LoginService){}

    currentUser: WritableSignal<User | null> = this.appstore.getCurrentUser()
    allAppartments: WritableSignal<Appartment[]> = this.appstore.getAllAppartments()
    reservations = signal<Reservation[]>([])
    owners: WritableSignal<Owner[]> = this.appstore.getOwners()


    ngOnInit(): void {
        this.getAppartments()
        this.getOwners()
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

  updateReservations(data: ReservationResearchRequest): void {
    console.log("data", data);
    
  }

}
