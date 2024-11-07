import { ChangeDetectorRef, Component, effect, input, OnInit, signal } from '@angular/core';
import { Reservation } from '../../models/Reservation.model';
import { CommonModule } from '@angular/common';
import { Appartment } from '../../models/Appartment.model';

@Component({
  selector: 'app-historique-reservation-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historique-reservation-card.component.html',
  styleUrl: './historique-reservation-card.component.scss'
})
export class HistoriqueReservationCardComponent implements OnInit {
  reservation = input.required<Reservation>()
  appartment = input.required<Appartment>()

  statut = signal<string>("")
  statutClass = signal<string>("")

  isSolded = signal<boolean>(false)

  ngOnInit(): void {    
    this.initStatut()
    this.initIsSolded()
  }

  initStatut(): void {
    if(this.reservation().cancelled){
      this.statut.set("ANNULEE")
      this.statutClass.set("textGray")
    } else if(this.reservation().accepted){
      this.statut.set("ACCEPTEE")
      this.statutClass.set("textGreen")
    } else {
      if(this.reservation().depositReceived) {
        this.statut.set("EN ATTENTE DE VALIDATION")
        this.statutClass.set("textOrange")
      } else if(this.reservation().depositAsked) {
        this.statut.set("EN ATTENTE DE RECEPTION DES ARRHES")
        this.statutClass.set("textOrange")
      } else {
        this.statut.set("EN ATTENTE DE TRAITEMENT")
        this.statutClass.set("textOrange")
      }
    }
  }

  initIsSolded(): void {
    const now = new Date()
    const checkDate = new Date(this.reservation().checkoutDate as Date)
    
    if(this.reservation().checkoutDate!.getTime() < now.getTime()){
      this.isSolded.set(true)
    }
  }
}
