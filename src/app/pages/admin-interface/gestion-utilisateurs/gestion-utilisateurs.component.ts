import { Component, computed, OnInit, WritableSignal } from '@angular/core';
import { UtilisateurService } from '../../../shared/utilisateur.service';
import { NotificationService } from '../../../shared/notification.service';
import { AppstoreService } from '../../../shared/appstore.service';
import { User } from '../../../models/User.model';
import { take } from 'rxjs';
import {MatTableModule} from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-gestion-utilisateurs',
  standalone: true,
  imports: [CommonModule, MatTableModule, FormsModule],
  templateUrl: './gestion-utilisateurs.component.html',
  styleUrl: './gestion-utilisateurs.component.scss'
})
export class GestionUtilisateursComponent implements OnInit {

  constructor(
    private readonly utilisateurService: UtilisateurService, 
    private readonly notificationService: NotificationService,
     private readonly appstore: AppstoreService,) {}

  allUsers: WritableSignal<User[]> = this.appstore.getAllUsers()

  sortedUsers = computed(() => this.allUsers().sort((a, b) => {
    const roleComparison = a.role.localeCompare(b.role);
    if (roleComparison !== 0) {
      return roleComparison;
    }
  
    const lastNameComparison = a.personalInformations.lastname.localeCompare(b.personalInformations.lastname);
    if (lastNameComparison !== 0) {
      return lastNameComparison;
    }

    return a.personalInformations.firstname.localeCompare(b.personalInformations.firstname);
  }));

  superAdmin = environment.superAdmin
  roleOptions = ["USER" , "OWNER" ,"ADMIN"]


  ngOnInit(): void {
      this.getAllUsers()
  }

  getAllUsers(): void {
    if(this.allUsers().length === 0){
      this.utilisateurService.getAll().pipe(take(1)).subscribe()
    }
  }



  changeRole(user: User, newRole: string) {
    const previousRole = user.role
    
    this.utilisateurService.updateRole(user.id, newRole).subscribe({
      error:() => {
        if(newRole === "USER") {
          this.notificationService.error("Un utilisateur propriétaire ne peut pas être rétrogragé au rang de simple utilisateur.")
        }else {
          this.notificationService.error("Le role de l'utilisateur n'a pas pu être mis à jour.")
        }
        user.role = previousRole as "ADMIN" | "OWNER" | "USER"
        this.appstore.updateOneUserInAllUsers(user)
      }
    })
    
  }

}
