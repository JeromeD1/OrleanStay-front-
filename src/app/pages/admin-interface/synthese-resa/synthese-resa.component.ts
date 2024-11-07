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

@Component({
  selector: 'app-synthese-resa',
  standalone: true,
  imports: [FormRechercheReservationComponent],
  templateUrl: './synthese-resa.component.html',
  styleUrl: './synthese-resa.component.scss'
})
export class SyntheseResaComponent implements OnInit {

  constructor(
    private readonly appstore: AppstoreService, 
    private readonly appartmentService: AppartmentsService, 
    private readonly notificationService: NotificationService, 
    private readonly utilisateurService: UtilisateurService,
    private readonly router: Router){}

    currentUser: WritableSignal<User | null> = this.appstore.getCurrentUser()
    allAppartments: WritableSignal<Appartment[]> = this.appstore.getAllAppartments()
    selectedAppartment = signal<Appartment>(this.allAppartments()[0])
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
            next: () => {
              this.selectedAppartment.set(this.allAppartments()[0])
            },
            error: (error) => this.notificationService.error(error)
          }
        )
      } else if (this.currentUser()?.role === "OWNER") {
        this.appartmentService.getAppartmentsByOwnerId(this.currentUser()?.id!).pipe(take(1)).subscribe(
          {
            next: () => {this.selectedAppartment.set(this.allAppartments()[0])},
            error: (error) => this.notificationService.error(error)
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

}
