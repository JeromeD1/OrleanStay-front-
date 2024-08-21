import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TravelInfo } from '../models/TravelInfo.model';
import { environment } from '../../environment/environment';
import { SomeFunctionsService } from './some-functions.service';

@Injectable({
  providedIn: 'root'
})
export class TravelInfoService {

  constructor(private readonly http: HttpClient, private someFunctions: SomeFunctionsService) { }

  getByAppartmentId(appartmentId: number): Observable<TravelInfo[]> {
    return this.http.get<TravelInfo[]>(`${environment.BACKEND_BASE_URL}/travelInfo/appartment/${appartmentId}`)
  }

  create(travelInfo: TravelInfo): Observable<TravelInfo> {
    return this.http.post<TravelInfo>(`${environment.BACKEND_BASE_URL}/travelInfo`, travelInfo)
  }

  update(travelInfo: TravelInfo): Observable<TravelInfo> {
    let params = new HttpParams();
    console.log("travelInfo", travelInfo);
    
    if(travelInfo.contentType === "IMG_URL"){
      console.log("dans condition");
      
      const oldImgId = this.someFunctions.convertImgId(this.someFunctions.extractIdFromUrl(travelInfo.content))
      params = params.set('oldImgId', oldImgId)
    }

    const options = {
      params: params
    }
    return this.http.put<TravelInfo>(`${environment.BACKEND_BASE_URL}/travelInfo/${travelInfo.id}`, travelInfo, options)
  }

  updateOrder(appartmentId: number, travelInfos: TravelInfo[]): Observable<TravelInfo[]> {
    return this.http.put<TravelInfo[]>(`${environment.BACKEND_BASE_URL}/travelInfo/appartment/${appartmentId}`, travelInfos)
  }

  // delete(id: number, oldImgUrl?: string): Observable<TravelInfo[]> {
  //   let params = new HttpParams();
    
  //   if(oldImgUrl){
  //     const oldImgId = this.someFunctions.convertImgId(this.someFunctions.extractIdFromUrl(oldImgUrl))
  //     params = params.set('oldImgId', oldImgId)
  //   }

  //   const options = {
  //     params: params
  //   }

  //   return this.http.delete<TravelInfo[]>(`${environment.BACKEND_BASE_URL}/travelInfo/${id}`,  options)
  // }

  delete(travelInfoToDelete: TravelInfo): Observable<TravelInfo[]> {
    let params = new HttpParams();
    
    if(travelInfoToDelete.contentType === "IMG_URL"){
      const oldImgId = this.someFunctions.convertImgId(this.someFunctions.extractIdFromUrl(travelInfoToDelete.content))
      params = params.set('oldImgId', oldImgId)
    }

    const options = {
      params: params
    }

    return this.http.delete<TravelInfo[]>(`${environment.BACKEND_BASE_URL}/travelInfo/${travelInfoToDelete.id}`,  options)
  }
}
