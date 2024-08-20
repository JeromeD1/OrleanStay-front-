import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Photo } from '../models/Photo.model';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environment/environment';
import { AppstoreService } from './appstore.service';

@Injectable({
  providedIn: 'root'
})
export class AppartmentPhotosService {

  constructor(private readonly http: HttpClient, private readonly appstore: AppstoreService) { }

  create(photo: Photo): Observable<Photo[]> {
    return this.http.post<Photo[]>(environment.BACKEND_BASE_URL + '/photo', photo).pipe(
      tap((data) => {
        this.appstore.addPhotoInAppartment(data)
      })
    )
  }

  update(photo: Photo, oldImgId: string): Observable<Photo> {
    return this.http.put<Photo>(environment.BACKEND_BASE_URL + '/photo/' + photo.id + "/oldImgId/" + oldImgId, photo).pipe(
      tap((data) => {
        this.appstore.updatePhotoInAppartment(data)
      })
    )
  }

  updateOrder(photos: Photo[]): Observable<Photo[]> {
    console.log("photos in updateOrder", photos);
    const objectToSend = {photos: photos}
    
    return this.http.put<Photo[]>(environment.BACKEND_BASE_URL + '/photo/updateOrder/' + photos[0].appartmentId, objectToSend).pipe(
      tap((data) => {
        console.log("in pipe, tap", data);
        
        //on met à jour les appartments via addPhotoInAppartment de l'appstore car cette méthode remplace tout le tableau photo... donc ok
        this.appstore.addPhotoInAppartment(data)
      })
    )
  }

  delete(photo: Photo, imgId: string): Observable<Photo[]> {
    return this.http.delete<Photo[]>(environment.BACKEND_BASE_URL + '/photo/' + photo.id + "/imgId/" + imgId).pipe(
      tap((data) => {
        console.log("data after delete photo :", data);
        
        this.appstore.addPhotoInAppartment(data)
      })
    )
  }
}
