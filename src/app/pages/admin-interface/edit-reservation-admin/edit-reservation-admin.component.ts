import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePickerComponent } from '../../../components/date-picker/date-picker.component';
import { ReactiveInputComponent } from '../../../shared/library/reactive-input/reactive-input.component';
import { ReactiveSelectComponent } from '../../../shared/library/reactive-select/reactive-select.component';
import { Reservation } from '../../../models/Reservation.model';
import { DateFromPicker } from '../../../models/DateFromPicker.model';
import { ReservationRequest } from '../../../models/Request/ReservationRequest.model';
import { Subject, take, takeUntil } from 'rxjs';
import { Appartment } from '../../../models/Appartment.model';
import { User } from '../../../models/User.model';
import { SomeFunctionsService } from '../../../shared/some-functions.service';
import { AppartmentsService } from '../../../shared/appartments.service';
import { AppstoreService } from '../../../shared/appstore.service';
import { BookingService } from '../../../shared/booking.service';
import { NotificationService } from '../../../shared/notification.service';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-edit-reservation-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePickerComponent, ReactiveInputComponent, ReactiveSelectComponent, MatSelectModule, MatFormFieldModule, MatOptionModule],
  templateUrl: './edit-reservation-admin.component.html',
  styleUrl: '../add-reservation/add-reservation.component.scss'
})
export class EditReservationAdminComponent {
  ownerAppartments: WritableSignal<Appartment[]> = this.appstore.getAllAppartments()
  appartmentIds = computed(() => this.ownerAppartments().map(item => item.id))
  selectedAppartment: WritableSignal<Appartment | null> = signal(null)
  currentUser: User | null = this.appstore.getCurrentUser()()

  selectedReservation: WritableSignal<Reservation | null> = signal(null)

  filteredReservationRequests = computed(() => {
    const reservations: Reservation[] = []
    const now = new Date()
    const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000
    // this.ownerAppartments().forEach(appart => {
      this.appstore.getAllAppartments()().forEach(appart => {
      appart.reservations.forEach(resa => {
        if(resa.checkoutDate!.getTime() + threeDaysInMilliseconds > now.getTime()){
          reservations.push(resa)
        }
      })
    })
    return reservations
  })

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
    private readonly fb: FormBuilder,
    private readonly  cdr: ChangeDetectorRef ){}

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

/*******************Choix de la réservation ************/
handleChangeReservation(reservation: Reservation) {
  this.selectedReservation.set(reservation) 
  this.resetForm()
}

/************* Fonction pour trouver un nom d'appartement en fonction de son id ***************/
findAppartmentNameById(id: number): string | undefined {
  return this.ownerAppartments().find(appartment => appartment.id == id)?.name
}

initForm():void {

  this.formResa = this.fb.group({
    appartmentId: new FormControl<number | null>(null, Validators.required),
    checkinDate: new FormControl<Date | null>(null, Validators.required),
    checkoutDate: new FormControl<Date | null>(null, Validators.required),
    nbAdult: [0, Validators.required],
    nbChild: [0, Validators.required],
    nbBaby: [0, Validators.required],
    reservationPrice: [0, Validators.required],
    cancelled:[false, Validators.required],
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
    appartmentId: this.selectedReservation()?.appartmentId,
    checkinDate: this.selectedReservation()?.checkinDate,
    checkoutDate: this.selectedReservation()?.checkoutDate,
    nbAdult: this.selectedReservation()?.nbAdult,
    nbChild: this.selectedReservation()?.nbChild,
    nbBaby: this.selectedReservation()?.nbBaby,
    reservationPrice: this.selectedReservation()?.reservationPrice,
    cancelled: this.selectedReservation()?.cancelled,
    firstname: this.selectedReservation()?.traveller?.personalInformations.firstname,
    lastname: this.selectedReservation()?.traveller?.personalInformations.lastname,
    email: this.selectedReservation()?.traveller?.personalInformations.email,
    phone: this.selectedReservation()?.traveller?.personalInformations.phone,
    address: this.selectedReservation()?.traveller?.personalInformations.address,
    zipcode: this.selectedReservation()?.traveller?.personalInformations.zipcode,
    city: this.selectedReservation()?.traveller?.personalInformations.city,
    country: this.selectedReservation()?.traveller?.personalInformations.country,
  })
}

saveReservation(): void {
  if(this.checkForm()){
    const formData: ReservationRequest = {
      traveller: {
        id: this.selectedReservation()?.traveller?.id,
        utilisateurId: this.selectedReservation()?.traveller?.utilisateurId,
        personalInformations: {
          id: this.selectedReservation()?.traveller?.personalInformations.id,
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
      cancelled: this.formResa.getRawValue().cancelled!,
      accepted: this.selectedReservation()?.accepted,
      depositAsked: this.selectedReservation()?.depositAsked,
      depositReceived: this.selectedReservation()?.depositReceived
    }

    console.log("formData", formData);
    this.reservationService.update(formData, this.selectedReservation()!.id!).pipe(take(1)).subscribe({
      next: (data) => {
        this.notificationService.success("Votre réservation a bien été modifiée.")
        this.selectedReservation.set((data as Reservation))
        this.cdr.detectChanges()
        console.log("selectedReservation",this.selectedReservation());
        console.log("filteredReservationRequests", this.filteredReservationRequests());
        
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
