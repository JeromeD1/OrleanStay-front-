import { Component, computed, OnDestroy, signal } from '@angular/core';
import { LoginService } from '../../shared/login.service';
import { Subject, takeUntil } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../shared/notification.service';
import { AppstoreService } from '../../shared/appstore.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.scss'
})
export class AdminNavbarComponent implements OnDestroy{
  constructor(private loginService: LoginService, private router: Router, private notificationService: NotificationService, private appstore: AppstoreService){}

  showMenuBurger: boolean = false
  showMenuReservation: boolean = false
  isOnPageReservation: boolean = false

  destroy$: Subject<void> = new Subject()

  currentPage = signal<"reservationRequest" | "reservationRegistoring" | "reservationEdition" | "globalGestion" | "gestionUtilisateurs">("reservationRequest")
  reservationCurrentPageText = computed(() => {
    switch (this.currentPage()){
      case "reservationRequest":
        return "Demandes de réservation"
        break
        case "reservationEdition":
          return "Modifier une réservation"
          break
          case "reservationRegistoring":
            return "Enregistrer une réservation"
            break
            default:
              return null
              break
    }
  })

  setShowMenuBurger(): void {
    this.showMenuBurger = !this.showMenuBurger
  }

  openMenuReservation(): void {
    this.showMenuReservation = true
  }

  closeMenuReservation(): void {
    this.showMenuReservation = false
  }

  logout(): void {    
  this.loginService.logout().pipe(takeUntil(this.destroy$)).subscribe(
    {
      next: () => {       
        this.appstore.resetAutenticatedSignals() 
        this.router.navigate(['/'])
        this.notificationService.success("Vous avez bien été déconnecté.")
      },
      error: (error) => {
        console.error(error)
        this.notificationService.error(error)
      }
    }
    
    )
  }

  setCurrentPageToReservationRequest(): void {
    this.currentPage.set("reservationRequest")
    this.isOnPageReservation = true
  }

  setCurrentPageToReservationRegistoring(): void {
    this.currentPage.set("reservationRegistoring")
    this.isOnPageReservation = true
  }

  setCurrentPageToReservationEdition(): void {
    this.currentPage.set("reservationEdition")
    this.isOnPageReservation = true
  }

  setCurrentPageToGlobalGestion(): void {
    this.currentPage.set("globalGestion")
    this.isOnPageReservation = false
  }

  setCurrentPageToGestionUtilisateurs(): void {
    this.currentPage.set("gestionUtilisateurs")
    this.isOnPageReservation = false
  }

  ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
  }
}
