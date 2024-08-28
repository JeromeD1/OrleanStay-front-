import { Component, computed, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { AppartmentsService } from '../../../shared/appartments.service';
import { Subject, take, takeUntil } from 'rxjs';
import { AppartmentNameAndOwner } from '../../../models/AppartmentNameAndOwner.model';
import { AppstoreService } from '../../../shared/appstore.service';
import { Appartment } from '../../../models/Appartment.model';
import { User } from '../../../models/User.model';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservationRequest } from '../../../models/Request/ReservationRequest.model';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from '../../../components/date-picker/date-picker.component';
import { DateFromPicker } from '../../../models/DateFromPicker.model';
import { ReactiveInputComponent } from '../../../shared/library/reactive-input/reactive-input.component';
import { ReactiveSelectComponent } from '../../../shared/library/reactive-select/reactive-select.component';
import { SomeFunctionsService } from '../../../shared/some-functions.service';
import { Reservation } from '../../../models/Reservation.model';
import { BookingService } from '../../../shared/booking.service';
import { NotificationService } from '../../../shared/notification.service';

@Component({
  selector: 'app-add-reservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePickerComponent, ReactiveInputComponent, ReactiveSelectComponent],
  templateUrl: './add-reservation.component.html',
  styleUrl: './add-reservation.component.scss'
})
export class AddReservationComponent implements OnInit, OnDestroy {

  ownerAppartments: WritableSignal<Appartment[]> = this.appstore.getAllAppartments()
  appartmentIds = computed(() => this.ownerAppartments().map(item => item.id))
  selectedAppartment: WritableSignal<Appartment | null> = signal(null)
  currentUser: User | null = this.appstore.getCurrentUser()()

  platformOptions: {platform: string}[] = [{platform: "Leboncoin"}, {platform: "Airbnb"}, {platform: "Booking"}]

  numberNight = signal<number | null>(null)

  destroy$: Subject<void> = new Subject()

  showPickerarrival: boolean = false
  showPickerDeparture: boolean = false

  constructor(
    private readonly appartmentService: AppartmentsService,
    private readonly appstore: AppstoreService,
    private readonly someFunctions: SomeFunctionsService,
    private readonly reservationService: BookingService,
    private readonly notificationService: NotificationService,
    private readonly router: Router, 
    private readonly fb: FormBuilder ){}

    formResa!: FormGroup

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
    this.initForm()
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

initForm():void {
  this.formResa = this.fb.group({
    appartmentId: new FormControl<number | null>(null, Validators.required),
    checkinDate: new FormControl<Date | null>(null, Validators.required),
    checkoutDate: new FormControl<Date | null>(null, Validators.required),
    nbAdult: [0, Validators.required],
    nbChild: [0, Validators.required],
    nbBaby: [0, Validators.required],
    accepted: [true],
    reservationPrice: [0, Validators.required],
    platform: ["Leboncoin", Validators.required],
    enterTravelerInfo: [false, Validators.required],
    firstname: ["Leboncoin", Validators.required],
    lastname: ["Leboncoin", Validators.required],
    email: ["Leboncoin@wrongemail.com", [Validators.required, Validators.email]],
    phone: ["Leboncoin", Validators.required],
    address: ["Leboncoin", Validators.required],
    zipcode: ["Leboncoin", Validators.required],
    city: ["Leboncoin", Validators.required],
    country: ["Leboncoin", Validators.required],
  })
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
      this.calculateNumberOfNight()
    }
  })

  this.formResa.get("checkoutDate")?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
    if(value){
      this.checkoutDateError = null
      this.calculateNumberOfNight()
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

  this.formResa.get("accepted")?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
    console.log(value);
    
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

resetForm():void {
  this.formResa.patchValue({
    appartmentId: null,
    checkinDate: null,
    checkoutDate: null,
    nbAdult: 0,
    nbChild: 0,
    nbBaby: 0,
    accepted: true,
    reservationPrice: 0,
    platform: "Leboncoin",
    enterTravelerInfo: false,
    firstname: "Leboncoin",
    lastname: "Leboncoin",
    email: "Leboncoin@wrongemail.com",
    phone: "Leboncoin",
    address: "Leboncoin",
    zipcode: "Leboncoin",
    city: "Leboncoin",
    country: "Leboncoin",
  })
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
      checkinDate: this.someFunctions.convertToUTCDate(this.formResa.getRawValue().checkinDate!),
      checkoutDate: this.someFunctions.convertToUTCDate(this.formResa.getRawValue().checkoutDate!),
      nbAdult: this.formResa.getRawValue().nbAdult!,
      nbChild: this.formResa.getRawValue().nbChild!,
      nbBaby: this.formResa.getRawValue().nbBaby!,
      reservationPrice: this.formResa.getRawValue().reservationPrice!,
      accepted: this.formResa.getRawValue().accepted!
    }

    console.log("formData", formData);
    this.reservationService.postTravellerReservation(formData).pipe(take(1)).subscribe({
      next: () => {
        this.notificationService.success("Votre réservation a bien été ajoutée.")
        this.resetForm()
      },
      error: () => {
        this.notificationService.error("Une erreur s'est produite lors de l'enregistrement de votre réservation.")
      }
    })
    
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

calculateNumberOfNight(): void {
  if(this.formResa.getRawValue().checkinDate && this.formResa.getRawValue().checkoutDate){
    const resaData: Reservation = {
      checkinDate: this.formResa.getRawValue().checkinDate,
      checkoutDate: this.formResa.getRawValue().checkoutDate,
      nbAdult:1,
      nbBaby:0,
      nbChild:0
    }
    this.numberNight.set(this.someFunctions.getNumberOfDays(resaData))
  }
}


ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
}
}
