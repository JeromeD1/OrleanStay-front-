import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReservationChat } from '../models/ReservationChat.model';
import { environment } from '../../environment/environment';
import { ReservationChatSaveRequest } from '../models/Request/ReservationChatSaveRequest.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationChatService {

  constructor(private readonly http: HttpClient) { }

  getAllByReservationId(reservationId: number): Observable<ReservationChat[]> {
    return this.http.get<ReservationChat[]>(environment.BACKEND_BASE_URL + `/reservationChat/reservation/${reservationId}`)
  }

  addNewComment(reservationChat: ReservationChatSaveRequest): Observable<ReservationChat> {
    return this.http.post<ReservationChat>(environment.BACKEND_BASE_URL + `/reservationChat`, reservationChat)
  }
}
