import { Component, computed, signal, WritableSignal } from '@angular/core';
import { AppstoreService } from '../../shared/appstore.service';
import { BookingService } from '../../shared/booking.service';
import { NotificationService } from '../../shared/notification.service';
import { User } from '../../models/User.model';
import { Reservation } from '../../models/Reservation.model';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NextReservationInfoComponent } from '../../components/next-reservation-info/next-reservation-info.component';

@Component({
  selector: 'app-admin-reservation-chat',
  standalone: true,
  imports: [CommonModule, NextReservationInfoComponent],
  templateUrl: './admin-reservation-chat.component.html',
  styleUrl: './admin-reservation-chat.component.scss'
})
export class AdminReservationChatComponent {

  reservationsWithWaitingChat = signal<Reservation[]>([])
  currentUser: WritableSignal<User | null> = this.appstore.getCurrentUser()

  sortedResertions = computed(() => this.reservationsWithWaitingChat().sort((a,b) => b.id! - a.id!))

  constructor(
    private readonly appstore: AppstoreService,
    private readonly reservationService: BookingService
  ) {}

  ngOnInit(): void {
      this.getReservationsWithWaitingChat()
  }


  getReservationsWithWaitingChat(): void {
    if(this.currentUser()?.id !== null)
    this.reservationService.findFilteredReservationsForReservationChatAnswering(this.currentUser()?.id!).pipe(take(1)).subscribe(
      {
        next:(data) => this.reservationsWithWaitingChat.set(data)
      })
  }

  removeReservationFromList(reservationId: number) {
    this.reservationsWithWaitingChat.update(value => value.filter(item => item.id !== reservationId))
  }


}
