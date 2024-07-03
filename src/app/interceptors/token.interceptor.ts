import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  
  const getCookie = (name: string): string | null => {
    const nameLenPlus = (name.length + 1);
    const cookieValue = document.cookie
      .split(';')
      .map(c => c.trim())
      .find(cookie => cookie.substring(0, nameLenPlus) === `${name}=`);
  
    return cookieValue 
      ? decodeURIComponent(cookieValue.substring(nameLenPlus)) 
      : null;
  };

  const refreshToken = getCookie("refreshToken")

  if(refreshToken){
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${refreshToken}`
      }
    })
    return next(modifiedReq);
  }

  //si pas de refreshToken, on passe la requete originale
  return next(req)
};
