import { Component, OnInit, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Owner } from '../../models/Owner.model';
import { Discount } from '../../models/Discount.model';
import { Appartment } from '../../models/Appartment.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-appartment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-appartment.component.html',
  styleUrl: './update-appartment.component.scss'
})
export class UpdateAppartmentComponent implements OnInit {

  owners = input.required<Owner[]>()
  discounts = input.required<Discount[]>()
  appartment = input.required<Appartment>()


  constructor(private fb: FormBuilder) {}

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
      caution: [0, Validators.required],
      menageCourtSejour: [0, Validators.required],
      menageLongSejour: [0, Validators.required],
      menageLongueDuree: [0, Validators.required],
      discountId: [0, Validators.required],
      ownerId: [0, Validators.required],
      type: ["", Validators.required],
      active: [false, Validators.required],
    }
  )

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


  private convertToPercent(value: number): string {
    return value * 100 + "%"
  }
}
