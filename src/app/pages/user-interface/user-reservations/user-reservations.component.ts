import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, ElementRef, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Reservation } from '../../../models/Reservation.model';
import { BookingService } from '../../../shared/booking.service';
import { NotificationService } from '../../../shared/notification.service';
import { User } from '../../../models/User.model';
import { AppstoreService } from '../../../shared/appstore.service';
import { take } from 'rxjs';
import { NextReservationInfoComponent } from '../../../components/next-reservation-info/next-reservation-info.component';

@Component({
  selector: 'app-user-reservations',
  standalone: true,
  imports: [CommonModule, MenuComponent, NextReservationInfoComponent],
  templateUrl: './user-reservations.component.html',
  styleUrl: './user-reservations.component.scss'
})
export class UserReservationsComponent implements OnInit, AfterViewInit {

  @ViewChild('imgCathedraleElement') imgCathedraleElement: ElementRef = {} as ElementRef
  @ViewChild('formContainerElement') formContainerElement: ElementRef = {} as ElementRef

  imgCathedrale: string = "../assets/global-pictures/cathedrale-orleans.jpg"
  iconMenu: string = "../assets/icons/icons-menu-noir.png"
  showMenu: boolean = false

  userReservations = signal<Reservation[]>([])
  currentUser: WritableSignal<User | null> = this.appstore.getCurrentUser()

  sortedResertions = computed(() => this.userReservations().sort((a,b) => b.id! - a.id!))

  constructor(
    private readonly appstore: AppstoreService,
    private readonly reservationService: BookingService, 
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
      this.getUserReservations()
  }

  ngAfterViewInit(): void {
    const formHeight = this.formContainerElement.nativeElement.offsetHeight;
    this.imgCathedraleElement.nativeElement.style.minHeight = `${formHeight}px`;
  }

  getUserReservations(): void {
    if(this.currentUser()?.id !== null)
    this.reservationService.getReservationsByUserId(this.currentUser()?.id!).pipe(take(1)).subscribe(
  {
    next:(data) => this.userReservations.set(data)
  })
  }

  verifyIfOld(checkoutDate: Date): boolean {
    const now = new Date()
    const verifiedDate = new Date(checkoutDate)
    return verifiedDate.getTime() < now.getTime()    
  }

  cancelReservation(formData: Reservation): void {
    this.reservationService.cancelFromTraveller(formData).pipe(take(1)).subscribe(
      {
        next:() => {
          this.notificationService.success(`Votre reservation a bien été annulée.`)
        },
        error: () => this.notificationService.error("Une erreur s'est produite, votre réservation n'a pas pu être annulée.")
      }
    )
  }

  openMenu(): void {
    this.showMenu = true
  }

  closeMenu(): void {
    this.showMenu = false
  }
}
