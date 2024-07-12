import { Component, OnDestroy, signal } from '@angular/core';
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

  destroy$: Subject<void> = new Subject()

  currentPage = signal<"reservationRequest" | "reservationRegistoring" | "globalGestion">("reservationRequest")

  setShowMenuBurger(): void {
    this.showMenuBurger = !this.showMenuBurger
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
  }

  setCurrentPageToReservationRegistoring(): void {
    this.currentPage.set("reservationRegistoring")
  }

  setCurrentPageToGlobalGestion(): void {
    this.currentPage.set("globalGestion")
  }

  ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
  }
}
