import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output, WritableSignal } from '@angular/core';
import { Feedback } from '../../models/Feedback.model';
import { FeedbackAnswer } from '../../models/FeedbackAnswer.model';
import { AppstoreService } from '../../shared/appstore.service';
import { User } from '../../models/User.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feedback-gestion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback-gestion.component.html',
  styleUrl: './feedback-gestion.component.scss'
})
export class FeedbackGestionComponent implements OnInit {

  feedback = input.required<Feedback>()
  deleteEmitter = output<number>()
  deleteAnswerEmitter = output<number>()
  answerEmitter = output<FeedbackAnswer>()
  answerModificationEmitter = output<FeedbackAnswer>()
  isModifyingAnswer: boolean = false

  private _answerComment: string = ""

  get answerComment(): string {
    return this._answerComment
  }

  set answerComment(comment: string) {
    this._answerComment = comment
  }

  currentUser: WritableSignal<User | null> = this.appstore.getCurrentUser()

  constructor(private readonly appstore: AppstoreService){}

  ngOnInit(): void {
      this.initAnswer()
  }

  initAnswer(): void {
    if(this.feedback().answer){
      this.answerComment = this.feedback().answer?.commentAnswer as string
    }
  }

  deleteFeedback(): void {
    this.deleteEmitter.emit(this.feedback().id as number)
  }

  deleteAnswer(): void {
    if(this.feedback().answer){
      this.deleteAnswerEmitter.emit(this.feedback().answer!.id as number)
      this.answerComment = ""
    }
  }

  answer(): void {
    if(this.answerComment.length > 5){
      if(this.feedback().answer){
        const formData: FeedbackAnswer = {
          id: this.feedback().answer?.id,
          commentId: this.feedback().id as number,
          commentAnswer: this.answerComment,
          utilisateurId: this.currentUser()?.id as number
        }
  
        this.answerModificationEmitter.emit(formData)
        this.setModifyingAnswer()
      } else {
        const formData: FeedbackAnswer = {
          commentId: this.feedback().id as number,
          commentAnswer: this.answerComment,
          utilisateurId: this.currentUser()?.id as number
        }
  
        this.answerEmitter.emit(formData)
      }
    }
  }

  setModifyingAnswer(): void {
    this.isModifyingAnswer = ! this.isModifyingAnswer
  }

}
