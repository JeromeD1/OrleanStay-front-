import { Component, OnDestroy, output, signal} from '@angular/core';
import { LoginService } from '../../shared/login.service';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private readonly loginService: LoginService) {}

  destroy$: Subject<void> = new Subject()

  closeEmitter = output<void>()
  createAccountEmitter = output<void>()

  login: string = ""
  password: string = ""
  wrongUserMessage = signal<string>("")

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
        next: () => {          
          this.closeLogin()
        },

        error: () => {
          this.wrongUserMessage.set("Votre email ou votre mot de passe n'est pas correct !")
        }
      } 
    )
  }

  openSignup(): void {
    this.createAccountEmitter.emit()
  }

  ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
  }
}
