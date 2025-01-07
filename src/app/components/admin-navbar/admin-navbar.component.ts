import { AfterContentInit, AfterViewInit, Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { LoginService } from '../../shared/login.service';
import { Subject, takeUntil } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../shared/notification.service';
import { AppstoreService } from '../../shared/appstore.service';
import { StatistiquesResaComponent } from '../statistiques-resa/statistiques-resa.component';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, StatistiquesResaComponent],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.scss'
})
export class AdminNavbarComponent implements AfterViewInit, OnDestroy{
  constructor(private loginService: LoginService, private router: Router, private notificationService: NotificationService, private appstore: AppstoreService){}

  showMenuBurger: boolean = false
  showMenuReservation: boolean = false
  showMenuCommunication: boolean = false
  isOnPageReservation = signal<boolean>(false)
  isOnPageCommunication = signal<boolean>(false)

  showStatComponent: boolean = false

  destroy$: Subject<void> = new Subject()

  currentPage = signal<"reservationRequest" | "reservationRegistoring" | "reservationEdition" | "syntheseReservation" | "globalGestion" | "gestionUtilisateurs" | "reservationChat" | "gestionCommentaires">("reservationRequest")
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
      case "syntheseReservation":
        return "Historique des réservations"
        break
      default:
        return null
        break
    }
  })

  communicationCurrentPageText = computed(() => {
    switch (this.currentPage()){
      case "reservationChat":
        return "Questions voyageurs"
        break
        case "gestionCommentaires":
          return "Gestion des avis"
          break
          default:
            return null
            break
    }
  })

  ngAfterViewInit(): void {
      this.getCurrentPage()
  }

  getCurrentPage():void {
    const adminPage = this.router.url.split("/").slice(-1)[0].trim()
    
    switch (adminPage){
      case "acceptReservation":
        this.setCurrentPageToReservationRequest()
        break
        case "addReservation":
        this.setCurrentPageToReservationRegistoring()
        break
        case "editReservation":
        this.setCurrentPageToReservationEdition()
        break
        case "syntheseReservation":
          this.setCurrentPageToSyntheseReservation()
        break
        case "appartGestion":
        this.setCurrentPageToGlobalGestion()
        break
        case "gestionUtilisateurs":
        this.setCurrentPageToGestionUtilisateurs()
        break
        case "reservationChat":
        this.setCurrentPageToReservationChat()
        break
        case "gestionCommentaires":
        this.setCurrentPageToGestionCommentaires()
        break
        default:
        break
    }
  }

  setShowMenuBurger(): void {
    this.showMenuBurger = !this.showMenuBurger
  }

  openMenuReservation(): void {
    this.showMenuReservation = true
  }

  closeMenuReservation(): void {
    this.showMenuReservation = false
  }

  openMenuCommunication(): void {
    this.showMenuCommunication = true
  }

  closeMenuCommunication(): void {
    this.showMenuCommunication = false
  }

  openStatComponent(): void {
    this.showStatComponent = true
  }

  closeStatComponent(): void {
    this.showStatComponent = false
  }

  logout(): void {    
  this.loginService.logout().pipe(takeUntil(this.destroy$)).subscribe(
    {
      next: () => {       
        this.appstore.resetAutenticatedSignals() 
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
    this.isOnPageReservation.set(true)
    this.isOnPageCommunication.set(false)
  }

  setCurrentPageToReservationRegistoring(): void {
    this.currentPage.set("reservationRegistoring")
    this.isOnPageReservation.set(true) 
    this.isOnPageCommunication.set(false) 
  }

  setCurrentPageToReservationEdition(): void {
    this.currentPage.set("reservationEdition")
    this.isOnPageReservation.set(true)
    this.isOnPageCommunication.set(false)
  }

  setCurrentPageToSyntheseReservation(): void {
    this.currentPage.set("syntheseReservation")
    this.isOnPageReservation.set(true)
    this.isOnPageCommunication.set(false)
  }

  setCurrentPageToGlobalGestion(): void {
    this.currentPage.set("globalGestion")
    this.isOnPageReservation.set(false)
    this.isOnPageCommunication.set(false)
  }

  setCurrentPageToGestionUtilisateurs(): void {
    this.currentPage.set("gestionUtilisateurs")
    this.isOnPageReservation.set(false)
    this.isOnPageCommunication.set(false)
  }

  setCurrentPageToReservationChat(): void {
    this.currentPage.set("reservationChat")
    this.isOnPageReservation.set(false)
    this.isOnPageCommunication.set(true)
  }

  setCurrentPageToGestionCommentaires(): void {
    this.currentPage.set("gestionCommentaires")
    this.isOnPageReservation.set(false)
    this.isOnPageCommunication.set(true)
  }

  ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
  }
}
