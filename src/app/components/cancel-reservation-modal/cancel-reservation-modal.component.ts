import { Component, input, OnInit, output, signal } from '@angular/core';
import { Reservation } from '../../models/Reservation.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cancel-reservation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cancel-reservation-modal.component.html',
  styleUrl: './cancel-reservation-modal.component.scss'
})
export class CancelReservationModalComponent implements OnInit {

  reservation = input.required<Reservation>()
  appartmentName = input.required<string>()
  closeEmitter = output<void>()
  validateEmitter = output<void>()

  cancelMessage = signal<string>("")
  isDateOutOfLimit = signal<boolean>(false)

  ngOnInit(): void {
      this.formatCancelMessage()
  }

  formatCancelMessage(): void {
    const now = new Date()
    const checkinDate = new Date(this.reservation().checkinDate as Date)
    const timeBeforeCheckin: number = checkinDate.getTime() - now.getTime()
    const isRefoundable: boolean = timeBeforeCheckin > 1000 * 3600 * 48

    console.log("timeBeforeCheckin", timeBeforeCheckin, "isRefoundable", isRefoundable);
    
    if(this.reservation().depositReceived && this.reservation().depositValue && this.reservation().depositValue! > 0) {
      if(isRefoundable) {
        this.cancelMessage.set(`Vous serez bientôt remboursés des arrhes versées, d'un montant de ${this.reservation().depositValue} €.`)
      } else {
        this.cancelMessage.set(`Les arrhes versées, d'un montant de ${this.reservation().depositValue} € ne vous seront donc pas remboursées.`)
        this.isDateOutOfLimit.set(true)
      }
    }
  }

  close(): void {
    this.closeEmitter.emit()
  }

  validate(): void {
    this.validateEmitter.emit()
  }

}
