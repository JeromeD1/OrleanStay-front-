import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { LoginService } from '../../shared/login.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppstoreService } from '../../shared/appstore.service';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy {

  constructor(private loginService: LoginService, private router: Router, private appstore: AppstoreService) {}

  destroy$: Subject<void> = new Subject()

  @Output()
  closeEmitter: EventEmitter<void> = new EventEmitter()

  login: string = ""
  password: string = ""
  wrongUserMessage!: string

  closeLogin(): void {
    this.closeEmitter.emit()
  }

  onSubmit(): void {
    const formData = {
      login: this.login,
      password: this.password
    }

    this.loginService.login(formData).subscribe(
      {
        next: (data) => {
          console.log("data in loginComponent after login", data);
          
          if(data?.utilisateur.role === "ADMIN"){
            this.router.navigate(['/admin'])
          } else {
            this.wrongUserMessage = "Vous n'avez pas les droits pour vous connecter !"
          }
        },

        error: () => {
          // FIXME / A SUPPRIMER 
          this.appstore.setCurrentUser({
            id: 0,
            role: "USER",
            personalInformations: {
              firstname: "Hector",
            lastname: "Legrand",
            email: "hector.legrand@gmail.com",
            phone: "06 87 78 98 24",
            address: "Dans ton cul",
            zipcode: "99 999",
            city: "Lune",
            country: "Espace"
            },
            creationDate: new Date()
          })

          this.appstore.setTraveller(
            {
              personalInformations: {
                firstname: "Hector",
                lastname: "Legrand",
                email: "hector.legrand@gmail.com",
                phone: "06 87 78 98 24",
                address: "Dans ton cul",
                zipcode: "99 999",
                city: "Lune",
                country: "Espace",
              }
              
            }
          )
        }
      }
      
      )

  }

  ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
  }
}
