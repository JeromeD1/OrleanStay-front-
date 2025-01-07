import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppstoreService } from '../shared/appstore.service';
import { User } from '../models/User.model';

export const authGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router)
  const currenUser: User | null = inject(AppstoreService).getCurrentUser()()
  const allowedRoles: string[] = route.data["allowedRoles"] || []

  if(currenUser && allowedRoles.includes(currenUser.role)) {
    return true
  }

  router.navigate(['/'])
  return false
};
