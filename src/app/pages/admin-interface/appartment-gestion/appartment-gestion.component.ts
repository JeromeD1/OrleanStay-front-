import { Component, OnDestroy, OnInit, WritableSignal, computed, signal } from '@angular/core';
import { User } from '../../../models/User.model';
import { AppstoreService } from '../../../shared/appstore.service';
import { AppartmentsService } from '../../../shared/appartments.service';
import { NotificationService } from '../../../shared/notification.service';
import { Appartment } from '../../../models/Appartment.model';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Discount } from '../../../models/Discount.model';
import { DiscountService } from '../../../shared/discount.service';
import {MatSelectModule} from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Owner } from '../../../models/Owner.model';
import { UtilisateurService } from '../../../shared/utilisateur.service';
import { UpdateAppartmentComponent } from '../../../components/update-appartment/update-appartment.component';

@Component({
  selector: 'app-appartment-gestion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatOptionModule, MatFormFieldModule, UpdateAppartmentComponent],
  templateUrl: './appartment-gestion.component.html',
  styleUrl: './appartment-gestion.component.scss'
})
export class AppartmentGestionComponent implements OnInit, OnDestroy {

  constructor(
    private appstore: AppstoreService, 
    private appartmentService: AppartmentsService, 
    private notificationService: NotificationService, 
    private discountService: DiscountService, 
    private utilisateurService: UtilisateurService,
    private fb: FormBuilder){}

  destroy$: Subject<void> = new Subject()
  currentUser: WritableSignal<User | null> = this.appstore.getCurrentUser()
  allAppartments: WritableSignal<Appartment[]> = this.appstore.getAllAppartments()
  selectedAppartment = signal<Appartment>(this.allAppartments()[0])
  discounts: WritableSignal<Discount[]> = this.appstore.getDiscounts()
  owners: WritableSignal<Owner[]> = this.appstore.getOwners()

  isAllDataCollected = computed(() => {
    console.log(this.allAppartments().length > 0 && this.discounts().length > 0 && this.owners().length > 0 && this.selectedAppartment().id > 0);
    
    return this.allAppartments().length > 0 && this.discounts().length > 0 && this.owners().length > 0 && this.selectedAppartment().id > 0
  })

  


  ngOnInit(): void {
      this.getDiscounts()
      this.getOwners()
      this.getAppartments()
  }

  getDiscounts(): void {
    if(this.discounts().length === 0) {
      this.discountService.getDiscounts().pipe(takeUntil(this.destroy$)).subscribe(
        {
          next:(data) => {console.log("discounts", this.discounts())},
          error: (error) => this.notificationService.error(error)
        })
    }
  }

  getOwners(): void {
    console.log("je suis dans getOwners");
    console.log("voici owners :", this.owners());
    
    if(this.owners().length === 0){
      console.log("je suis dans condition getOwners");
      this.utilisateurService.getAllOwners().pipe(takeUntil(this.destroy$)).subscribe(
        {
          next:(data) => {console.log("owners", this.owners())},
          error: (error) => this.notificationService.error(error)
        }
      )
    }
  }

  getAppartments(): void {
    console.log("je suis dans getappartment");
    
    if(this.allAppartments().length === 0) {
      console.log("je suis dans condition getappartment");
      if(this.currentUser()?.role === "ADMIN") {
        this.appartmentService.getAllAppartments().pipe(takeUntil(this.destroy$)).subscribe(
          {
            next: () => {this.selectedAppartment.set(this.allAppartments()[0])
              console.log("selected appartment", this.selectedAppartment());
              
            },
            error: (error) => this.notificationService.error(error)
          }
        )
      } else if (this.currentUser()?.role === "OWNER") {
        this.appartmentService.getAppartmentsByOwnerId(this.currentUser()?.id!).pipe(takeUntil(this.destroy$)).subscribe(
          {
            next: () => {this.selectedAppartment.set(this.allAppartments()[0])},
            error: (error) => this.notificationService.error(error)
          }
        )
      }
    }
  }


  handleChangeAppartment(appartment: Appartment) {
    this.selectedAppartment.set(appartment)
    console.log(this.selectedAppartment());
    
  }

  ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
  }
}
