import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AppstoreService } from '../shared/appstore.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  
  const refreshToken = inject(AppstoreService).getToken()  
  const storageToken = localStorage.getItem("refreshToken")

  const token = refreshToken ? refreshToken : storageToken
  

  if(token){
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true
    })
    
    return next(modifiedReq);
  }

  //si pas de refreshToken, on passe la requete originale
  return next(req)
};
