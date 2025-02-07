import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feedback } from '../models/Feedback.model';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environment/environment';
import { AppstoreService } from './appstore.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackServiceService {

  constructor(private readonly http: HttpClient, private readonly appstore: AppstoreService) { }

  create(feedback: Feedback): Observable<Feedback> {
    return this.http.post<Feedback>(environment.BACKEND_BASE_URL + `/feedback`, feedback).pipe(
      tap((data) => this.appstore.addFeedback(data))
    )
  }

  getAll(): Observable<Feedback[]>{
    return this.http.get<Feedback[]>(environment.BACKEND_BASE_URL + `/feedback`).pipe(
      tap((data) => this.appstore.setAllFeedbacks(data))
    )
  }

  getByUserIdAndAppartmentId(userId: number, appartmentId:number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(environment.BACKEND_BASE_URL + `/feedback/utilisateur/${userId}/appartment/${appartmentId}`)
  }

  getByReservationId(reservationId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(environment.BACKEND_BASE_URL + `/feedback/reservation/${reservationId}`)
  }

  delete(feedbackId: number): Observable<void> {
    return this.http.delete<void>(environment.BACKEND_BASE_URL + `/feedback/${feedbackId}`).pipe(
      tap(() => this.appstore.removeFeedback(feedbackId))
    )
  }
}
