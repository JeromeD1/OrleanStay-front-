import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppstoreService } from './appstore.service';
import { FeedbackAnswer } from '../models/FeedbackAnswer.model';
import { Observable, tap } from 'rxjs';
import { Feedback } from '../models/Feedback.model';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackAnswerService {

  constructor(private readonly http: HttpClient, private readonly appstore: AppstoreService) { }

  create(answer: FeedbackAnswer): Observable<Feedback> {
    return this.http.post<Feedback>(environment.BACKEND_BASE_URL + `/feedbackAnswer`, answer).pipe(
      tap((data) => this.appstore.updateFeedback(data))
    )
  }

  update(answer: FeedbackAnswer): Observable<Feedback> {
    return this.http.put<Feedback>(environment.BACKEND_BASE_URL + `/feedbackAnswer/${answer.id}`, answer).pipe(
      tap((data) => this.appstore.updateFeedback(data))
    )
  }

  delete(answerId: number): Observable<void> {
    return this.http.delete<void>(environment.BACKEND_BASE_URL + `/feedbackAnswer/${answerId}`).pipe(
      tap(() => this.appstore.removeAnswerInFeedback(answerId))
    )
  }
}
