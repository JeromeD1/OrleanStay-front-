import { Component, computed, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { AppartmentsService } from '../../../shared/appartments.service';
import { Subject, take, takeUntil } from 'rxjs';
import { AppartmentNameAndOwner } from '../../../models/AppartmentNameAndOwner.model';
import { AppstoreService } from '../../../shared/appstore.service';
import { Appartment } from '../../../models/Appartment.model';
import { User } from '../../../models/User.model';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservationRequest } from '../../../models/Request/ReservationRequest.model';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from '../../../components/date-picker/date-picker.component';
import { DateFromPicker } from '../../../models/DateFromPicker.model';

@Component({
  selector: 'app-add-reservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePickerComponent],
  templateUrl: './add-reservation.component.html',
  styleUrl: './add-reservation.component.scss'
})
export class AddReservationComponent implements OnInit, OnDestroy {

  ownerAppartments: WritableSignal<Appartment[]> = this.appstore.getAllAppartments()
  appartmentIds = computed(() => this.ownerAppartments().map(item => item.id))
  selectedAppartment: WritableSignal<Appartment | null> = signal(null)
  currentUser: User | null = this.appstore.getCurrentUser()()

  platformOptions: string[] = ["Leboncoin", "Airbnb", "Booking"]

  destroy$: Subject<void> = new Subject()

  showPickerarrival: boolean = false
  showPickerDeparture: boolean = false

  constructor(
    private readonly appartmentService: AppartmentsService,
    private readonly appstore: AppstoreService,
    private readonly router: Router, 
    private readonly fb: FormBuilder ){}


  formResa = this.fb.group({
    appartmentId: [0, Validators.required],
    checkinDate: new FormControl<Date | null>(null, Validators.required),
    checkoutDate: new FormControl<Date | null>(null, Validators.required),
    nbAdult: [0, Validators.required],
    nbChild: [0, Validators.required],
    nbBaby: [0, Validators.required],
    accepted: [true],
    reservationPrice: [0, Validators.required],
    platform: ["Leboncoin", Validators.required],
    enterTravelerInfo: [false, Validators.required],
    firstname: ["", Validators.required],
    lastname: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    phone: ["", Validators.required],
    address: ["", Validators.required],
    zipcode: ["", Validators.required],
    city: ["", Validators.required],
    country: ["", Validators.required],
  })

  appartmentIdError: string | null = null
  checkinDateError: string | null = null
  checkoutDateError: string | null = null
  nbAdultError: string | null = null
  nbChildError: string | null = null
  nbBabyError: string | null = null
  reservationPriceError: string | null = null
  firstnameError: string | null = null
  lastnameError: string | null = null
  emailError: string | null = null
  phoneError: string | null = null
  addressError: string | null = null
  zipcodeError: string | null = null
  cityError: string | null = null
  countryError: string | null = null



ngOnInit(): void {
    this.getOwnerAppartments()
    this.initEvents()
}

getOwnerAppartments(): void {
  console.log("currentUser", this.currentUser);
  if(this.currentUser && this.currentUser.role !== "USER") {   
    this.appartmentService.getAppartmentsByOwnerId(this.currentUser?.id).pipe(take(1)).subscribe()
  } else {
    this.router.navigate(["/"])
  }
}


initEvents(): void {
  this.formResa.get("appartmentId")?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
    if(value && this.appartmentIds().includes(Number(value))){
      this.appartmentIdError = null
      this.selectedAppartment.set(this.ownerAppartments().find(item => item.id == value)!)
    }
  })

  this.formResa.get("checkinDate")?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
    if(value){
      this.checkinDateError = null
    }
  })

  this.formResa.get("checkoutDate")?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
    if(value){
      this.checkoutDateError = null
    }
  })

  this.formResa.get("nbAdult")?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
    if(value && value > 0){
      this.nbAdultError = null
      this.calculateReservationPrice()
    }
  })

  this.formResa.get("nbChild")?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
    if(value && value >= 0){
      this.nbChildError = null
      this.calculateReservationPrice()
    }
  })

  this.formResa.get("nbBaby")?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
    if(value && value >= 0){
      this.nbBabyError = null
    }
  })

  this.formResa.get("reservationPrice")?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
    if(value && value >= 0){
      this.reservationPriceError = null
    }
  })

  this.formResa.get("platform")?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
    if(value === "Leboncoin" && this.formResa.get("enterTravelerInfo")?.value === false){
      this.formResa.patchValue({
        firstname: "Leboncoin",
        lastname: "Leboncoin",
        email: "Leboncoin@wrongemail.com",
        phone: "Leboncoin",
        address: "Leboncoin",
        zipcode: "Leboncoin",
        city: "Leboncoin",
        country: "Leboncoin"
      })
    } else if(value === "Airbnb" && this.formResa.get("enterTravelerInfo")?.value === false){
      this.formResa.patchValue({
        firstname: "Airbnb",
        lastname: "Airbnb",
        email: "Airbnb@wrongemail.com",
        phone: "Airbnb",
        address: "Airbnb",
        zipcode: "Airbnb",
        city: "Airbnb",
        country: "Airbnb"
      })
    } else if(value === "Booking" && this.formResa.get("enterTravelerInfo")?.value === false){
      this.formResa.patchValue({
        firstname: "Booking",
        lastname: "Booking",
        email: "Booking@wrongemail.com",
        phone: "Booking",
        address: "Booking",
        zipcode: "Booking",
        city: "Booking",
        country: "Booking"
      })
    }
  })

  this.formResa.get("enterTravelerInfo")?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
    if(value === true){
      this.formResa.patchValue({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        address: "",
        zipcode: "",
        city: "",
        country: ""
      })
    } else if(this.formResa.get("platform")?.value === "Leboncoin"){
      this.formResa.patchValue({
        firstname: "Leboncoin",
        lastname: "Leboncoin",
        email: "Leboncoin@wrongemail.com",
        phone: "Leboncoin",
        address: "Leboncoin",
        zipcode: "Leboncoin",
        city: "Leboncoin",
        country: "Leboncoin"
      })
    } else if(this.formResa.get("platform")?.value === "Airbnb"){
      this.formResa.patchValue({
        firstname: "Airbnb",
        lastname: "Airbnb",
        email: "Airbnb@wrongemail.com",
        phone: "Airbnb",
        address: "Airbnb",
        zipcode: "Airbnb",
        city: "Airbnb",
        country: "Airbnb"
      })
    } else if(this.formResa.get("platform")?.value === "Booking"){
      this.formResa.patchValue({
        firstname: "Booking",
        lastname: "Booking",
        email: "Booking@wrongemail.com",
        phone: "Booking",
        address: "Booking",
        zipcode: "Booking",
        city: "Booking",
        country: "Booking"
      })
    }
  })

  this.formResa.get("firstname")?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
    if(value){
      this.firstnameError = null
    }
  })

  this.formResa.get("lastname")?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
    if(value){
      this.lastnameError = null
    }
  })

  this.formResa.get("email")?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
    if(value && ! this.formResa.get("email")?.hasError("email")){
      this.emailError = null
    }
  })

  this.formResa.get("phone")?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
    if(value){
      this.phoneError = null
    }
  })

  this.formResa.get("address")?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
    if(value){
      this.addressError = null
    }
  })

  this.formResa.get("zipcode")?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
    if(value){
      this.zipcodeError = null
    }
  })

  this.formResa.get("city")?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
    if(value){
      this.cityError = null
    }
  })

  this.formResa.get("country")?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
    if(value){
      this.countryError = null
    }
  })
}

checkForm(): boolean {
  let isValid = true

  if(this.formResa.get("appartmentId")?.hasError("required")){
    isValid = false
    this.appartmentIdError = "Le champ est requis."
  }

  if(this.formResa.get("checkinDate")?.hasError("required")){
    isValid = false
    this.checkinDateError = "Le champ est requis."
  }

  if(this.formResa.get("checkoutDate")?.hasError("required")){
    isValid = false
    this.checkoutDateError = "Le champ est requis."
  }

  if(this.formResa.get("checkinDate")?.value?.getTime()! > this.formResa.get("checkoutDate")?.value?.getTime()!){
    isValid = false
    this.checkoutDateError = "La date de sortie doit être ultérieure à la date d'entrée."
  }

  if(this.formResa.get("nbAdult")?.hasError("required")){
    isValid = false
    this.nbAdultError = "Le champ est requis."
  }

  if(this.formResa.get("nbAdult")?.value! < 1){
    isValid = false
    this.nbAdultError = "Il doit y avoir au moins 1 adulte dans une réservation."
  }

  if(this.formResa.get("nbChild")?.hasError("required")){
    isValid = false
    this.nbChildError = "Le champ est requis."
  }

  if(this.formResa.get("nbBaby")?.hasError("required")){
    isValid = false
    this.nbBabyError = "Le champ est requis."
  }

  if(this.formResa.get("reservationPrice")?.hasError("required")){
    isValid = false
    this.reservationPriceError = "Le champ est requis."
  }

  if(this.formResa.get("firstname")?.hasError("required")){
    isValid = false
    this.firstnameError = "Le champ est requis."
  }

  if(this.formResa.get("lastname")?.hasError("required")){
    isValid = false
    this.lastnameError = "Le champ est requis."
  }

  if(this.formResa.get("email")?.hasError("required")){
    isValid = false
    this.emailError = "Le champ est requis."
  }

  if(this.formResa.get("email")?.hasError("email")){
    isValid = false
    this.emailError = "Email invalide."
  }

  if(this.formResa.get("phone")?.hasError("required")){
    isValid = false
    this.phoneError = "Le champ est requis."
  }

  if(this.formResa.get("address")?.hasError("required")){
    isValid = false
    this.addressError = "Le champ est requis."
  }

  if(this.formResa.get("zipcode")?.hasError("required")){
    isValid = false
    this.zipcodeError = "Le champ est requis."
  }

  if(this.formResa.get("city")?.hasError("required")){
    isValid = false
    this.cityError = "Le champ est requis."
  }

  if(this.formResa.get("country")?.hasError("required")){
    isValid = false
    this.countryError = "Le champ est requis."
  }

  return isValid
}


saveReservation(): void {
  if(this.checkForm()){
    const formData: ReservationRequest = {
      traveller: {
        personalInformations: {
          firstname: this.formResa.getRawValue().firstname!,
          lastname: this.formResa.getRawValue().lastname!,
          email: this.formResa.getRawValue().email!,
          phone: this.formResa.getRawValue().phone!,
          address: this.formResa.getRawValue().address!,
          zipcode: this.formResa.getRawValue().zipcode!,
          city: this.formResa.getRawValue().city!,
          country: this.formResa.getRawValue().country!,
        }
      },
      appartmentId: this.formResa.getRawValue().appartmentId!,
      checkinDate: this.formResa.getRawValue().checkinDate!,
      checkoutDate: this.formResa.getRawValue().checkoutDate!,
      nbAdult: this.formResa.getRawValue().nbAdult!,
      nbChild: this.formResa.getRawValue().nbChild!,
      nbBaby: this.formResa.getRawValue().nbBaby!,
      reservationPrice: this.formResa.getRawValue().reservationPrice!,
      accepted: this.formResa.getRawValue().accepted!
    }

    console.log("formData", formData);
    
  }
}


/***********Date pickers ***************/
changeShowPickerarrival():void {
  this.showPickerarrival = !this.showPickerarrival;
}

changeShowPickerDeparture():void {
this.showPickerDeparture = !this.showPickerDeparture;
}

closeAllPicker(): void {
this.showPickerarrival = false;
this.showPickerDeparture = false;
}

handleChangeCheckinOrCheckout(event: DateFromPicker): void {
  
  if(event.type === 'checkin') {
    this.formResa.patchValue({
      checkinDate: event.date
    })
    this.changeShowPickerarrival();
  } else if(event.type === 'checkout') {
    this.formResa.patchValue({
      checkoutDate: event.date
    })
    this.changeShowPickerDeparture();
  }

  this.calculateReservationPrice()
  

}

calculateReservationPrice(): void {
  if(this.formResa.getRawValue().checkinDate && this.formResa.getRawValue().checkoutDate && this.formResa.getRawValue().nbAdult){ 
    this.formResa.patchValue({
      reservationPrice: this.selectedAppartment()?.calculateReservationPrice(this.formResa.getRawValue().nbAdult!, this.formResa.getRawValue().nbChild!, this.formResa.getRawValue().checkinDate!, this.formResa.getRawValue().checkoutDate!)
    })   
  }
}


ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
}
}
