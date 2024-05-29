import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { LoginService } from '../../shared/login.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
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

  constructor(private loginService: LoginService, private router: Router) {}

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

    this.loginService.login(formData).subscribe(data => {
      if(data?.role === "admin"){
        this.router.navigate(['/admin'])
      } else {
        this.wrongUserMessage = "Vous n'avez pas les droits pour vous connecter !"
      }
    })

  }

  ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
  }
}
