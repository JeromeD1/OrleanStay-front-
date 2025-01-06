import { Component, output, signal} from '@angular/core';
import { LoginService } from '../../shared/login.service';
import { Subject, take } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatCheckboxModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private readonly loginService: LoginService, private readonly notificationService: NotificationService) {}

  closeEmitter = output<void>()
  createAccountEmitter = output<void>()

  login: string = ""
  password: string = ""
  isPasswordForgotten = signal<boolean>(false)
  wrongUserMessage = signal<string>("")

  closeLogin(): void {
    this.closeEmitter.emit()
  }

  onSubmit(): void {
    const formData = {
      login: this.login,
      password: this.password
    }

    if(this.isPasswordForgotten()){
      this.loginService.askForReinitializingPassword(this.login).pipe(take(1)).subscribe(
        {
          next:(data) => {
            if(data === true) {
              this.notificationService.success("Un email de réinitialisation vient de vous être envoyé à votre adresse mail.")
              this.closeLogin()
            } else {
              this.notificationService.error("L'email fourni ne correspond à aucun utilisateur enregistré.")
            }
          },
          error: () => this.notificationService.error("Une erreur est survenue, veuillez réessayer plus tard.")
        }
      )
    } else {
      this.loginService.login(formData).pipe(take(1)).subscribe(
        {
          next: () => {          
            this.closeLogin()
          },
  
          error: () => {
            this.wrongUserMessage.set("Votre email ou votre mot de passe n'est pas correct !")
          }
        } 
      )
    }
  }

  setForgottenPassword(): void {
    this.isPasswordForgotten.set(!this.isPasswordForgotten())
    this.login = ""
  }

  openSignup(): void {
    this.createAccountEmitter.emit()
  }

}
