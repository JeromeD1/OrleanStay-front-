import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal, WritableSignal } from '@angular/core';
import { AppstoreService } from '../../../shared/appstore.service';
import { NotificationService } from '../../../shared/notification.service';
import { User } from '../../../models/User.model';
import { Feedback } from '../../../models/Feedback.model';
import { Appartment } from '../../../models/Appartment.model';
import { AppartmentsService } from '../../../shared/appartments.service';
import { take } from 'rxjs';
import { FeedbackServiceService } from '../../../shared/feedback-service.service';

import { MatSelect, MatSelectModule} from '@angular/material/select';
import { FeedbackGestionComponent } from '../../../components/feedback-gestion/feedback-gestion.component';
import { FeedbackAnswer } from '../../../models/FeedbackAnswer.model';
import { FeedbackAnswerService } from '../../../shared/feedback-answer.service';

@Component({
  selector: 'app-gestion-avis',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatSelect, FeedbackGestionComponent],
  templateUrl: './gestion-avis.component.html',
  styleUrl: './gestion-avis.component.scss'
})
export class GestionAvisComponent implements OnInit {

    constructor(
      private readonly appstore: AppstoreService,
      private readonly appartmentService: AppartmentsService,
      private readonly feedbackService: FeedbackServiceService,
      private readonly feadbackAnswerService: FeedbackAnswerService,
      private readonly notificationService: NotificationService
    ){}

    currentUser: WritableSignal<User | null> = this.appstore.getCurrentUser()
    allAppartments: WritableSignal<Appartment[]> = this.appstore.getAllAppartments()
    selectedAppartment = signal<Appartment>({} as Appartment)
    allFeedbacks: WritableSignal<Feedback[]> = this.appstore.getAllFeedbacks()

    appartmentFeedbacks = computed(() => this.allFeedbacks().filter(feedback => feedback.appartmentId === this.selectedAppartment().id).sort((a,b) => b.id! - a.id!))

    ngOnInit(): void {
        this.getAllAppartments()
        this.getAllFeedbacks()
    }

    getAllAppartments(): void {
      if(this.allAppartments().length === 0) {
        if(this.currentUser()?.role === "ADMIN"){
          this.appartmentService.getAllAppartments().pipe(take(1)).subscribe({
            next:() => this.selectedAppartment.set(this.allAppartments()[0])
          })
        } else if(this.currentUser()?.role === "OWNER"){
          this.appartmentService.getAppartmentsByOwnerId(this.currentUser()?.id as number).pipe(take(1)).subscribe({
            next:() => this.selectedAppartment.set(this.allAppartments()[0])
          })
        }
      } else {
        this.selectedAppartment.set(this.allAppartments()[0])
      }
    }

    getAllFeedbacks(): void {
      if(this.allFeedbacks().length === 0){
        this.feedbackService.getAll().pipe(take(1)).subscribe(
          {
            next: (data) => {
              console.log("data", data);
              console.log("this.allFeedbacks()", this.allFeedbacks());
              
              
            }
          }
        )
      }
    }


    handleChangeAppartment(appartment: Appartment): void {
        this.selectedAppartment.set(appartment)
    }

    deleteFeedback(feedbackId: number): void {
      this.feedbackService.delete(feedbackId).pipe(take(1)).subscribe(
        {
          next:() => this.notificationService.success("L'avis a bien été supprimé."),
          error:() => this.notificationService.error("Une erreur s'est produite lors de la suppression de l'avis, veuillez réessayer.")
        }
      )
    }

    addFeedbackAnswer(answer: FeedbackAnswer): void {
      this.feadbackAnswerService.create(answer).pipe(take(1)).subscribe(
        {
          error:() => this.notificationService.error("Une erreur s'est produite, veuillez réessayer.")
        }
      )
    }

    updateFeedbackAnswer(answer: FeedbackAnswer): void {
      this.feadbackAnswerService.update(answer).pipe(take(1)).subscribe(
        {
          error:() => this.notificationService.error("Une erreur s'est produite, veuillez réessayer.")
        }
      )
    }

    deleteAnswer(answerId: number): void {
      this.feadbackAnswerService.delete(answerId).pipe(take(1)).subscribe(
        {
          error:() => this.notificationService.error("Une erreur s'est produite, veuillez réessayer.")
        }
      )
    }
}
