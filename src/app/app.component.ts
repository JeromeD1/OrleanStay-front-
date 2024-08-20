import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppstoreService } from './shared/appstore.service';
import { User } from './models/User.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'OrleanStay';

  constructor(private readonly appstore: AppstoreService) {}

  ngOnInit(): void {
   this.initSession()   
  }

  initSession(): void {
    if(localStorage.getItem("currentUser")){
      const sessionUser: User | null = JSON.parse(localStorage.getItem("currentUser")!)
      this.appstore.setCurrentUser(sessionUser)
    }
  }
}
