import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, computed, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Owner } from '../../models/Owner.model';
import { Discount } from '../../models/Discount.model';
import {MatIconModule} from '@angular/material/icon'
import { CommonModule } from '@angular/common';
import { AppartmentSaveRequest } from '../../models/Request/AppartmentSaveRequest.model';
import { NotificationService } from '../../shared/notification.service';
import { DiscountService } from '../../shared/discount.service';
import { CreateDiscountComponent } from '../create-discount/create-discount.component';

@Component({
  selector: 'app-create-appartment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatCheckboxModule, MatIconModule, CreateDiscountComponent],
  templateUrl: './create-appartment.component.html',
  styleUrl: '../update-appartment/update-appartment.component.scss'
})
export class CreateAppartmentComponent implements OnInit{

  owners = input.required<Owner[]>()
  discounts = input.required<Discount[]>()

  appartEmitter = output<AppartmentSaveRequest>()

  showCreateDiscount: boolean = false

  constructor(private fb: FormBuilder, private notificationService: NotificationService, private discountService: DiscountService, private cdr: ChangeDetectorRef) {}

  appartmentTypes: string[] = ["SAISONNIER", "LONGUE_DUREE"]

  appartmentForm = this.fb.group(
    {
      name: ["", Validators.required],
      description: ["", Validators.required],
      address: ["", Validators.required],
      zipcode: ["", Validators.required],
      city: ["", Validators.required],
      googleMapUrl: ["", Validators.required],
      distanceCityCenter: ["", Validators.required],
      distanceTrain: ["", Validators.required],
      distanceTram: ["", Validators.required],
      nightPrice: [50, Validators.required],
      caution: [300, Validators.required],
      menageCourtSejour: [30, Validators.required],
      menageLongSejour: [50, Validators.required],
      menageLongueDuree: [90, Validators.required],
      discountId: [0, Validators.required],
      ownerId: [0, Validators.required],
      type: ["LONGUE_DUREE", Validators.required],
      active: [true, Validators.required],
    }
  )

  ngOnInit(): void {
      this.appartmentForm.patchValue(
        {
          ownerId: this.owners()[0].id,
          discountId: this.discounts()[0].id
        }
      )
  }

  getOwnerNameById(id: number): string {
    const owner: Owner | undefined = this.owners().find(owner => owner.id === id)
    return `${owner?.firstname} ${owner?.lastname}`
  }

  getInfoDiscountById(id: number): string | null {
    const discount: Discount | undefined = this.discounts().find(discount => discount.id === id)
    if(discount) {
      if(discount.weekActivated && discount.monthActivated) {
        return `${this.convertToPercent(discount?.week)} à la semaine - ${this.convertToPercent(discount?.month)} au mois`
      } else if(discount.weekActivated && !discount.monthActivated) {
        return `${this.convertToPercent(discount?.week)} à la semaine`
      } else if(!discount.weekActivated && discount.monthActivated) {
        return `${this.convertToPercent(discount?.month)} au mois`
      } else {
        return "Aucune réduction"
      }
    } else {
      return null
    }
  }


  onSubmit() {
    
    if(this.appartmentForm.valid) {
      const formData: AppartmentSaveRequest = {
        ownerId: this.appartmentForm.value.ownerId!,
        discountId: this.appartmentForm.value.discountId!,
        name: this.appartmentForm.value.name!,
        description: this.appartmentForm.value.description!,
        address: this.appartmentForm.value.address!,
        zipcode: this.appartmentForm.value.zipcode!,
        city: this.appartmentForm.value.city!,
        distanceCityCenter: this.appartmentForm.value.distanceCityCenter!,
        distanceTrain: this.appartmentForm.value.distanceTrain!,
        distanceTram: this.appartmentForm.value.distanceTram!,
        googleMapUrl: this.appartmentForm.value.googleMapUrl!,
        nightPrice: this.appartmentForm.value.nightPrice!,
        caution: this.appartmentForm.value.caution!,
        menageCourtSejour: this.appartmentForm.value.menageCourtSejour!,
        menageLongSejour: this.appartmentForm.value.menageLongSejour!,
        menageLongueDuree: this.appartmentForm.value.menageLongueDuree!,
        type: this.appartmentForm.value.type!,
        active: this.appartmentForm.value.active!,
      }

      this.appartEmitter.emit(formData)      
    }
    
  }

  private convertToPercent(value: number): string {
    return Math.round((1 - value) * 100) + "%"
  }


   /****Fonctions relatives à la création des discounts *******/
   setShowDiscountComponent(): void {
    this.showCreateDiscount = true
  }

  setHideDiscountComponent(): void {
    this.showCreateDiscount = false
  }

  createNewDiscount(discount: Discount): void {
    this.discountService.create(discount).subscribe({
      next: () => {
        this.notificationService.success("Le jeu de réduction a bien été ajouté")        
        this.cdr.detectChanges() //pour que dans l'enfant createDiscount la modif de discounts soit détectée
      },
      error: () => this.notificationService.error("Une erreur s'est produite lors de l'enregistrement du jeu de réduction")
    })
    
  }
}
