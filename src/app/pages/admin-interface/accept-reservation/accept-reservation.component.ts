import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppartmentsService } from '../../../shared/appartments.service';
import { AppstoreService } from '../../../shared/appstore.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-accept-reservation',
  standalone: true,
  imports: [],
  templateUrl: './accept-reservation.component.html',
  styleUrl: './accept-reservation.component.scss'
})
export class AcceptReservationComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject()

  constructor(private appartmentService: AppartmentsService, private appStore:AppstoreService) {}

  ngOnInit(): void {
      this.getAppartments()
  }

  getAppartments(): void {
    this.appartmentService.getAppartments().pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (data) => {console.log("appartments, " , data);
        } 
      }
    )
  }

  ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
  }
}
