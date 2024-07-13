import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, input, output } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import {MatCheckboxModule} from '@angular/material/checkbox'
import { Owner } from '../../models/Owner.model'
import { Discount } from '../../models/Discount.model'
import { Appartment } from '../../models/Appartment.model'
import { CommonModule } from '@angular/common'
import { AppartmentSaveRequest } from '../../models/Request/AppartmentSaveRequest.model'
import { CreateDiscountComponent } from '../create-discount/create-discount.component'
import {MatIconModule} from '@angular/material/icon'
import { DiscountService } from '../../shared/discount.service'
import { NotificationService } from '../../shared/notification.service'

@Component({
  selector: 'app-update-appartment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatCheckboxModule, CreateDiscountComponent, MatIconModule],
  templateUrl: './update-appartment.component.html',
  styleUrl: './update-appartment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateAppartmentComponent implements OnInit {

  owners = input.required<Owner[]>()
  discounts = input.required<Discount[]>()
  appartment = input.required<Appartment>()

  appartEmitter = output<AppartmentSaveRequest>()
  modificationEmitter = output<boolean>()
  onClickSelectAppartmentEmitter = output<AppartmentSaveRequest>()

  @Input() set detectClickOnSelectAppartment(value: number) {
    const formData: AppartmentSaveRequest = {
      id: this.appartment().id,
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
    
      this.onClickSelectAppartmentEmitter.emit(formData)
  }


  constructor(private fb: FormBuilder, private discountService: DiscountService, private notificationService: NotificationService, private cdr: ChangeDetectorRef) {}

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
      nightPrice: [0, Validators.required],
      caution: [300, Validators.required],
      menageCourtSejour: [0, Validators.required],
      menageLongSejour: [0, Validators.required],
      menageLongueDuree: [0, Validators.required],
      discountId: [0, Validators.required],
      ownerId: [0, Validators.required],
      type: ["", Validators.required],
      active: [false, Validators.required],
    }
  )

  showCreateDiscount: boolean = false

  ngOnInit(): void {

    this.appartmentForm.patchValue({
      name: this.appartment().name,
      description: this.appartment().description,
      address: this.appartment().address,
      zipcode: this.appartment().zipcode,
      city: this.appartment().city,
      googleMapUrl: this.appartment().googleMapUrl,
      distanceCityCenter: this.appartment().distanceCityCenter,
      distanceTrain: this.appartment().distanceTrain,
      distanceTram: this.appartment().distanceTram,
      nightPrice: this.appartment().nightPrice,
      caution: this.appartment().caution,
      menageCourtSejour: this.appartment().menageCourtSejour,
      menageLongSejour: this.appartment().menageLongSejour,
      menageLongueDuree: this.appartment().menageLongueDuree,
      discountId: this.appartment().discounts.id,
      ownerId: this.appartment().ownerId,
      type: this.appartment().type,
      active: this.appartment().active

    })
    
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

  onModification(): void {
    this.modificationEmitter.emit(true)
  }

  onSubmit() {
    
    if(this.appartmentForm.valid) {
      const formData: AppartmentSaveRequest = {
        id: this.appartment().id,
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
    } else {
      this.appartmentForm.markAllAsTouched()
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
    console.log("new discount", discount);
    this.discountService.create(discount).subscribe({
      next: () => {
        this.notificationService.success("Le jeu de réduction a bien été ajouté")
        console.log("changement ?", this.discounts());
        
        this.cdr.detectChanges()
      },
      error: () => this.notificationService.error("Une erreur s'est produite lors de l'enregistrement du jeu de réduction")
    })
    
  }
}
