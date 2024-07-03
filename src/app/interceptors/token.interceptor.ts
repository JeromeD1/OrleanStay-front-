import { HttpInterceptorFn } from '@angular/common/http';
import { Inject, inject } from '@angular/core';
import { AppstoreService } from '../shared/appstore.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  
  // const getCookie = (name: string): string | null => {
  //   const nameLenPlus = (name.length + 1);
  //   console.log("document.cookie", document.cookie);
    
  //   const cookieValue = document.cookie
  //     .split(';')
  //     .map(c => c.trim())
  //     .find(cookie => cookie.substring(0, nameLenPlus) === `${name}=`);
  
  //   return cookieValue 
  //     ? decodeURIComponent(cookieValue.substring(nameLenPlus)) 
  //     : null;
  // };

  // const refreshToken = getCookie("refreshToken")
  const refreshToken = inject(AppstoreService).getToken()
  console.log("refreshToken", refreshToken);
  

  if(refreshToken){
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${refreshToken}`
      }
    })
    console.log("modifiedReq", modifiedReq);
    
    return next(modifiedReq);
  }

  //si pas de refreshToken, on passe la requete originale
  return next(req)
};
