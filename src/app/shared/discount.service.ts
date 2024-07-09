import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Discount } from '../models/Discount.model';
import { environment } from '../../environment/environment';
import { AppstoreService } from './appstore.service';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  constructor(private http: HttpClient, private appstore: AppstoreService) { }

  getDiscounts(): Observable<Discount[]> {
    return this.http.get<Discount[]>(`${environment.BACKEND_BASE_URL}/discount`).pipe(
      tap((data) => this.appstore.setDiscounts(data))
    )
  }

  create(discountToCreate: Discount): Observable<Discount> {
    return this.http.post<Discount>(`${environment.BACKEND_BASE_URL}/discount`, discountToCreate).pipe(
      tap((data) => this.appstore.createDiscount(data))
    )
  }

  update(discountToUpdate: Discount): Observable<Discount> {
    return this.http.put<Discount>(`${environment.BACKEND_BASE_URL}/discount/${discountToUpdate.id}`, discountToUpdate).pipe(
      tap((data) => this.appstore.updateDiscount(data))
    )
  }
}
