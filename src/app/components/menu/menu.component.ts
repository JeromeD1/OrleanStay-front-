import { Component, input, OnInit, signal, WritableSignal } from '@angular/core';
import { AppstoreService } from '../../shared/appstore.service';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../models/User.model';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../shared/login.service';
import { take } from 'rxjs';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit{
  constructor(
    private readonly appstore: AppstoreService, 
    private readonly loginService: LoginService, 
    private readonly notificationService: NotificationService, 
    private readonly router: Router) {}

  currentUser: WritableSignal<User | null> = this.appstore.getCurrentUser()

  currentPage: string = ""

  ngOnInit(): void {
      this.checkCurrentPage()
  }

  logout(): void {
    this.loginService.logout().pipe(take(1)).subscribe({
      next: () => this.notificationService.success("Vous avez été déconnecté avec succès."),
      error: () => this.notificationService.error("Une erreur s'est produite lors de la déconnexion, veuillez réessayer.")
    })
  }

  checkCurrentPage() :void {
      this.currentPage = this.router.url
  }
}
