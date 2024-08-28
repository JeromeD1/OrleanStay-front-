import { AfterContentInit, AfterViewInit, Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
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
export class AdminNavbarComponent implements AfterViewInit, OnDestroy{
  constructor(private loginService: LoginService, private router: Router, private notificationService: NotificationService, private appstore: AppstoreService){}

  showMenuBurger: boolean = false
  showMenuReservation: boolean = false
  isOnPageReservation = signal<boolean>(false)

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

  ngAfterViewInit(): void {
      this.getCurrentPage()
  }

  getCurrentPage():void {
    const adminPage = this.router.url.split("/").slice(-1)[0].trim()
    console.log("adminPage", adminPage);
    
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
        case "appartGestion":
        this.setCurrentPageToGlobalGestion()
        break
        case "gestionUtilisateurs":
        this.setCurrentPageToGestionUtilisateurs()
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
    this.isOnPageReservation.set(true)
    console.log("test");
    
  }

  setCurrentPageToReservationRegistoring(): void {
    this.currentPage.set("reservationRegistoring")
    this.isOnPageReservation.set(true)  
  }

  setCurrentPageToReservationEdition(): void {
    this.currentPage.set("reservationEdition")
    this.isOnPageReservation.set(true)
  }

  setCurrentPageToGlobalGestion(): void {
    this.currentPage.set("globalGestion")
    this.isOnPageReservation.set(false)
  }

  setCurrentPageToGestionUtilisateurs(): void {
    this.currentPage.set("gestionUtilisateurs")
    this.isOnPageReservation.set(false)
  }

  ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
  }
}
