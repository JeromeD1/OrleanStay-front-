import { Component, signal, WritableSignal } from '@angular/core';
import { AppstoreService } from '../../shared/appstore.service';
import { RouterModule } from '@angular/router';
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
export class MenuComponent {
  constructor(private readonly appstore: AppstoreService, private readonly loginService: LoginService, private readonly notificationService: NotificationService) {}

  currentUser: WritableSignal<User | null> = this.appstore.getCurrentUser()


  logout(): void {
    this.loginService.logout().pipe(take(1)).subscribe({
      next: () => this.notificationService.success("Vous avez été déconnecté avec succès."),
      error: () => this.notificationService.error("Une erreur s'est produite lors de la déconnexion, veuillez réessayer.")
    })
  }
}
