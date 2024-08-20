import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CloudinarySignature } from '../models/CloudinarySignature.model';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  constructor(private readonly http: HttpClient) { }

  getCloudinarySignature(overwrite: boolean, publicId?: string): Observable<CloudinarySignature> {
    if(publicId){
      return this.http.get<CloudinarySignature>(`${environment.BACKEND_BASE_URL}/cloudinary/signature?publicId=${publicId}&overwrite=${overwrite}`)
    } else {
      return this.http.get<CloudinarySignature>(`${environment.BACKEND_BASE_URL}/cloudinary/signature?overwrite=${overwrite}`)

    }
  }
}
