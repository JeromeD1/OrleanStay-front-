import { ResolveFn, Router } from '@angular/router';
import { TravelInfo } from '../../../models/TravelInfo.model';
import { catchError, map, Observable, of } from 'rxjs';
import { inject } from '@angular/core';
import { TravelInfoService } from '../../../shared/travel-info.service';

export const infoResaResolver: ResolveFn<TravelInfo[]> = (route, state): Observable<TravelInfo[]> => {

  const reservationId = route.paramMap.get("reservationId")
  const travellerId = route.paramMap.get("travellerId")

  const router: Router = inject(Router)

  if(reservationId && travellerId) {

    return inject(TravelInfoService).getByReservationAndTravellerIds(Number(reservationId), Number(travellerId)).pipe( 
      map(data => { 
        if (data) { 
          return data
         } else { 
          router.navigate(['notFound'])
           return []; 
          } })
          , 
          catchError(() => { 
          router.navigate(['notFound'])
          return of()
          }) 
        )
  } else {
    router.navigate(['notFound'])
    return of()
  }

};
