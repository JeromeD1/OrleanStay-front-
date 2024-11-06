import { Component, OnInit, WritableSignal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AppstoreService } from './shared/appstore.service';
import { User } from './models/User.model';
import { LoginService } from './shared/login.service';
import { UtilisateurService } from './shared/utilisateur.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'OrleanStay';

  currentUser: WritableSignal<User | null> = this.appstore.getCurrentUser()

  constructor(
    private readonly appstore: AppstoreService,
    private readonly router: Router,
    private readonly loginService: LoginService,
    private readonly utilisateurService: UtilisateurService
  ) {}

  ngOnInit(): void {
   this.initSession()   
  }

  initSession(): void {
    if(localStorage.getItem("currentUser")){
      const sessionUser: User | null = JSON.parse(localStorage.getItem("currentUser")!)
      if(sessionUser) {
        this.appstore.setCurrentUser(sessionUser)
        this.verifySessionActivity()
      }
    }
  }

  verifySessionActivity(): void {
    this.loginService.verifySessionActivity().pipe(take(1)).subscribe(
      {
        error: () => {
          this.loginService.logout().pipe(take(1)).subscribe()
          this.router.navigate(["/"])
        }
      }
    )
  }
}
