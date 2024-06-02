import { Component, OnDestroy } from '@angular/core';
import { LoginService } from '../../shared/login.service';
import { Subject, takeUntil } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.scss'
})
export class AdminNavbarComponent implements OnDestroy{
  constructor(private loginService: LoginService, private router: Router){}

  showMenuBurger: boolean = false

  destroy$: Subject<void> = new Subject()

  setShowMenuBurger(): void {
    this.showMenuBurger = !this.showMenuBurger
  }

  logout(): void {
    console.log("quitter");
    
  this.loginService.logout().pipe(takeUntil(this.destroy$)).subscribe(
    () => {this.router.navigate(['/'])},
    (error) => console.error(error)
    )
  }


  ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
  }
}
