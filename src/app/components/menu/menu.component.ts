import { Component, signal, WritableSignal } from '@angular/core';
import { AppstoreService } from '../../shared/appstore.service';
import { RouterModule } from '@angular/router';
import { User } from '../../models/User.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  constructor(private readonly appstore: AppstoreService) {}

  currentUser: WritableSignal<User | null> = this.appstore.getCurrentUser()
}
