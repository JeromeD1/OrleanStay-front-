import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, WritableSignal, input, output } from '@angular/core';
import { Discount } from '../../models/Discount.model';
import { SomeFunctionsService } from '../../shared/some-functions.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox'
import { NotificationService } from '../../shared/notification.service';
import { AppstoreService } from '../../shared/appstore.service';

@Component({
  selector: 'app-create-discount',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCheckboxModule],
  templateUrl: './create-discount.component.html',
  styleUrl: './create-discount.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateDiscountComponent{

  constructor(private someFunctions: SomeFunctionsService, private fb: FormBuilder, private notificationService: NotificationService, private appstore: AppstoreService) {
    this.discountForm.get('week')?.valueChanges.subscribe()
    this.discountForm.get('weekActivated')?.valueChanges.subscribe()
    this.discountForm.get('month')?.valueChanges.subscribe()
    this.discountForm.get('monthActivated')?.valueChanges.subscribe()
  }

  
  closeEmitter = output<void>()
  discountEmitter = output<Discount>()
  // discounts = input.required<Discount[]>()
  discounts: WritableSignal<Discount[]> = this.appstore.getDiscounts()
  // @Input() set discounts(data :Discount[]) {
  //   this.allDiscounts = data
  // }
  
  // allDiscounts!: Discount[]

  discountForm = this.fb.group({
    week: [0, Validators.required],
    weekActivated: [false, Validators.required],
    month: [0, Validators.required],
    monthActivated: [false, Validators.required]
  })

  // ngOnChanges(changes: SimpleChanges): void {
  //     this.allDiscounts = changes['discounts'].currentValue;
  // }

  compareDiscountWithFormValues(discount: Discount): boolean {
    const weekEquals: boolean = Math.round((1 - discount.week) * 100) == this.discountForm.value.week
    const weekActivatedEquals: boolean = discount.weekActivated == this.discountForm.value.weekActivated
    const monthEquals: boolean = Math.round((1 - discount.month) * 100) == this.discountForm.value.month
    const monthActivatedEquals: boolean = discount.monthActivated == this.discountForm.value.monthActivated

    if(this.discountForm.value.weekActivated && this.discountForm.value.monthActivated) {
      return weekEquals && weekActivatedEquals && monthEquals && monthActivatedEquals
    } else if(!this.discountForm.value.weekActivated && this.discountForm.value.monthActivated) {
      return monthEquals && monthActivatedEquals && !discount.weekActivated
    } else if(!this.discountForm.value.monthActivated && this.discountForm.value.weekActivated) {
      return weekEquals && weekActivatedEquals && !discount.monthActivated
    } else {
      return monthActivatedEquals && weekActivatedEquals
    }
  }
  
  getDiscountInfos(id: number): string | null {
    return this.someFunctions.getInfoDiscountById(id, this.discounts())
  }

  // getDiscountInfos(id: number): string | null {
  //   return this.someFunctions.getInfoDiscountById(id, this.allDiscounts)
  // }

  onSubmit(): void {
    if(!this.discountForm.valid) {
      this.notificationService.error("Veillez à remplir tous les champs avant de soumettre le formulaire.")
    } else {
      let isAlreadyPresent: boolean = false
      for(const discount of this.discounts()){
        // for(const discount of this.allDiscounts){
        if(this.compareDiscountWithFormValues(discount)){
          isAlreadyPresent = true
        }
      }
      if(isAlreadyPresent){
        this.notificationService.error("Impossible d'ajouter un type de réduction déjà existant.")
      } else {
        const formData: Discount = {
          week: 1 - (this.discountForm.value.week! / 100),
          weekActivated: this.discountForm.value.weekActivated!,
          month: 1 - (this.discountForm.value.month! / 100),
          monthActivated: this.discountForm.value.monthActivated!
        }

        this.discountEmitter.emit(formData)
        // this.closeCreateDiscount()
      }
    }
  }

  closeCreateDiscount(): void {
    this.closeEmitter.emit()
  }
}
