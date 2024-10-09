import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feedback } from '../models/Feedback.model';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackServiceService {

  constructor(private readonly http: HttpClient) { }

  create(feedback: Feedback): Observable<Feedback> {
    return this.http.post<Feedback>(environment.BACKEND_BASE_URL + `/feedback`, feedback)
  }

  getByUserIdAndAppartmentId(userId: number, appartmentId:number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(environment.BACKEND_BASE_URL + `/feedback/utilisateur/${userId}/appartment/${appartmentId}`)
  }

  getByReservationId(reservationId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(environment.BACKEND_BASE_URL + `/feedback/reservation/${reservationId}`)
  }

  delete(feedbackId: number): Observable<Feedback> {
    return this.http.delete<Feedback>(environment.BACKEND_BASE_URL + `/feedback/${feedbackId}`)
  }
}
