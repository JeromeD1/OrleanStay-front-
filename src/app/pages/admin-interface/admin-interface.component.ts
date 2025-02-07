import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../../components/admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-admin-interface',
  standalone: true,
  imports: [RouterModule, AdminNavbarComponent],
  templateUrl: './admin-interface.component.html',
  styleUrl: './admin-interface.component.scss'
})
export class AdminInterfaceComponent {

}
