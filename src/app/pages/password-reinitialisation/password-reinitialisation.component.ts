import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { LoginService } from '../../shared/login.service';
import { NotificationService } from '../../shared/notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-password-reinitialisation',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './password-reinitialisation.component.html',
  styleUrl: '../../components/login/login.component.scss'
})
export class PasswordReinitialisationComponent implements OnInit {

  constructor(
    private readonly loginService: LoginService, 
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}


  password: string = ""
  confirmationPassword: string = ""
  token: string | null = ""

  ngOnInit(): void {
      this.token = this.route.snapshot.paramMap.get("token")
  }

  close(): void {
    this.router.navigate(['/'])
  }

  onSubmit(): void {
    const formData = {
      password: this.password,
      confirmationPassword: this.confirmationPassword,
      token: this.token
    }

      this.loginService.reinitialisePassword(formData).pipe(take(1)).subscribe(
        {
          next: (data) => {         
            if(data === true) {
              this.close()
              this.notificationService.success("Votre mot de passe a bien été modifié.")
            } else {
              this.notificationService.error("Le temps pour la réinitialisation du mot de passe est expiré. Veuillez refaire une demande de réinitialisation.")
            }
          },
  
          error: () => {
            this.notificationService.error("Une erreur est survenue, veuillez réessayer plus tard.")
          }
        } 
      )
    
  }

}
