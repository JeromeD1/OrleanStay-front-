import { Component, computed, input, OnInit, signal, WritableSignal } from '@angular/core';
import { Reservation } from '../../models/Reservation.model';
import { ReservationChat } from '../../models/ReservationChat.model';
import { ReservationChatService } from '../../shared/reservation-chat.service';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Appartment } from '../../models/Appartment.model';
import { AppartmentsService } from '../../shared/appartments.service';
import {MatExpansionModule} from '@angular/material/expansion';
import { ReservationChatSaveRequest } from '../../models/Request/ReservationChatSaveRequest.model';
import { NotificationService } from '../../shared/notification.service';
import { FormsModule } from '@angular/forms';
import { AppstoreService } from '../../shared/appstore.service';
import { User } from '../../models/User.model';
import { TravelInfoOverviewComponent } from '../travel-info-overview/travel-info-overview.component';
import { TravelInfo } from '../../models/TravelInfo.model';
import { TravelInfoService } from '../../shared/travel-info.service';
import { TravelInfoPopupComponent } from '../travel-info-popup/travel-info-popup.component';
import { Feedback } from '../../models/Feedback.model';
import { FeedbackServiceService } from '../../shared/feedback-service.service';

@Component({
  selector: 'app-next-reservation-info',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, FormsModule, TravelInfoPopupComponent],
  templateUrl: './next-reservation-info.component.html',
  styleUrl: './next-reservation-info.component.scss'
})
export class NextReservationInfoComponent implements OnInit {
  reservation = input.required<Reservation>()
  isOld = input.required<boolean>()

  commentChatList = signal<ReservationChat[]>([])
  sortedCommentChatList = computed(() => this.commentChatList().sort((a,b) => b.id! - a.id!))

  feedbackList = signal<Feedback[]>([])
  sortedFeedbackList = computed(() => this.feedbackList().sort((a,b) => b.id! - a.id!))

  appartment = signal<Appartment | null>(null)
  currentUser: WritableSignal<User | null> = this.appstore.getCurrentUser()
  showArrivalDetails: boolean = false
  travelInfos = signal<TravelInfo[]>([])



  newQuestionSignal = signal<string>("")

  get newQuestion() {
    return this.newQuestionSignal()
  }

  set newQuestion(value: string) {
    this.newQuestionSignal.set(value)
  }


  constructor(
    private readonly reservationChatService: ReservationChatService,
    private readonly appartmentService: AppartmentsService,
    private readonly notificationService: NotificationService,
    private readonly appstore: AppstoreService,
    private readonly travelInfoService: TravelInfoService,
    private readonly feedbackService: FeedbackServiceService
  ) {

  }

  ngOnInit(): void {
      this.getCommentChatList()
      this.getAppartment()
  }

  getCommentChatList(): void {
    if(this.reservation().id && !this.isOld) {
      this.reservationChatService.getAllByReservationId(this.reservation().id as number).pipe(take(1)).subscribe(
        {
          next: (data) => this.commentChatList.set(data)
        }
      )
    }
  }

  getAppartment(): void {
    this.appartmentService.getAppartmentById(this.reservation().appartmentId as number).pipe(take(1)).subscribe(
      {
        next: (data) => {
          this.appartment.set(data)
          if(!this.isOld){
            this.getTravelInfos(data.id)
          } else {
            this.getFeedBack(data.id)
          }
        }
      }
    )
  }

  getTravelInfos(appartmentId: number): void {
    this.travelInfoService.getByAppartmentId(appartmentId).pipe(take(1)).subscribe(
      {
        next: (data) => this.travelInfos.set(data)
      }
    )
    
  }

  getFeedBack(appartmentId: number): void {
    if(this.currentUser()){
      this.feedbackService.getByUserIdAndAppartmentId(this.currentUser()?.id as number, appartmentId).pipe(take(1)).subscribe(
        {
          next: (data) => {
            this.feedbackList.set(data)
          console.log("feedbacks", data);
          
          }
        }
      )
    }
  }


  sendQuestion(): void {
    
    if(this.newQuestion.length >= 10) {
      const formData: ReservationChatSaveRequest = {
        comment: this.newQuestion,
        utilisateurId: this.reservation().traveller?.utilisateurId as number,
        reservationId: this.reservation().id as number
      }
      this.reservationChatService.addNewComment(formData).pipe(take(1)).subscribe(
        {
          next: (data) => {
            console.log("data", data);
            this.commentChatList.update(value => [...value, data])
            this.newQuestion = ""
          },
          error: () => this.notificationService.error("Une erreur s'est produite lors de l'envoi de votre question.")
        }
      )
    } else {
      this.notificationService.error("Veuillez saisir au moins 10 caractères.")
    }
  }

  sendFeedBack(): void {
    if(this.newQuestion.length >= 10) {
      const formData: Feedback = {
        comment: this.newQuestion,
        utilisateurId: this.reservation().traveller?.utilisateurId as number,
        appartmentId: this.appartment()!.id as number
      }
      this.feedbackService.create(formData).pipe(take(1)).subscribe(
        {
          next: (data) => {
            console.log("data", data);
            this.feedbackList.update(value => [...value, data])
            this.newQuestion = ""
          },
          error: () => this.notificationService.error("Une erreur s'est produite lors de l'envoi de votre avis.")
        }
      )
    } else {
      this.notificationService.error("Veuillez saisir au moins 10 caractères.")
    }
  }

  openArrivalDetails(): void {
    this.showArrivalDetails = true
  }

  closeArrivalDetails(): void {
    this.showArrivalDetails = false
  }
}
