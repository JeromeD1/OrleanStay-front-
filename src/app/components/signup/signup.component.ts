import { Component, EventEmitter, OnDestroy, OnInit, output, Output } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import { LoginService } from '../../shared/login.service';
import { Router } from '@angular/router';
import { AppstoreService } from '../../shared/appstore.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserSaveRequest } from '../../models/Request/UserSaveRequest.model';
import { NotificationService } from '../../shared/notification.service';
import { ReactiveInputComponent } from '../../shared/library/reactive-input/reactive-input.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ReactiveInputComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit, OnDestroy {
  constructor(private readonly loginService: LoginService, private readonly fb: FormBuilder, private readonly notificationService: NotificationService) {}


  closeEmitter = output<void>()

  destroy$: Subject<void> = new Subject()

  emailError: string | null = null
  password1Error: string | null = null
  password2Error: string | null = null
  firstnameError: string | null = null
  lastnameError: string | null = null
  phoneError: string | null = null
  zipcodeError: string | null = null
  addressError: string | null = null
  cityError: string | null = null
  countryError: string | null = null

  signupForm = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password1: ["", Validators.required],
    password2: ["", Validators.required],
    firstname: ["", Validators.required],
    lastname: ["", Validators.required],
    phone: ["", Validators.required],
    zipcode: ["", Validators.required],
    address: ["", Validators.required],
    city: ["", Validators.required],
    country: ["", Validators.required]
  })

  ngOnInit(): void {
      this.initEvent()
  }

  initEvent(): void {
    this.signupForm.get('email')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if(!this.signupForm.get('email')?.hasError('email')){
        this.emailError = null
      }
    })

    this.signupForm.get('password1')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if(value && value.length >= 8){
        this.password1Error = null
      }
    })

    this.signupForm.get('password2')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      const password1 = this.signupForm.get('password1')?.value
      if(value === password1){
        this.password2Error = null
      }
    })

    this.signupForm.get('firstname')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if(value !== ""){
        this.firstnameError = null
      }
    })

    this.signupForm.get('lastname')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if(value !== ""){
        this.firstnameError = null
      }
    })

    this.signupForm.get('phone')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if(value !== ""){
        this.firstnameError = null
      }
    })

    this.signupForm.get('zipcode')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if(value !== ""){
        this.firstnameError = null
      }
    })

    this.signupForm.get('address')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if(value !== ""){
        this.firstnameError = null
      }
    })

    this.signupForm.get('city')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if(value !== ""){
        this.firstnameError = null
      }
    })

    this.signupForm.get('country')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if(value !== ""){
        this.firstnameError = null
      }
    })
  }

  checkForm(): boolean {
    let isValid = true

    if(this.signupForm.get('email')?.hasError('email')) {
      this.emailError = "L'email doit être valide."
      isValid = false
    }

    if(this.signupForm.get('email')?.hasError('required')) {
      this.emailError = "Le champ est requis."
      isValid = false
    }

    if(this.signupForm!.get('password1')!.value!.length < 8) {
      this.password1Error = "Le mot de passe doit contenir au moins 8 caractères."
      isValid = false
    }

    if(this.signupForm.get('password1')?.hasError('required')) {
      this.password1Error = "Le champ est requis."
      isValid = false
    }

    if(this.signupForm.get('password1')?.value !== this.signupForm.get('password2')?.value) {
      this.password2Error = "Les deux mots de passes doivent être identiques."
      isValid = false
    }

    if(this.signupForm.get('password2')?.hasError('required')) {
      this.password2Error = "Le champ est requis."
      isValid = false
    }

    if(this.signupForm.get('firstname')?.hasError('required')) {
      this.firstnameError = "Le champ est requis."
      isValid = false
    }

    if(this.signupForm.get('lastname')?.hasError('required')) {
      this.lastnameError = "Le champ est requis."
      isValid = false
    }

    if(this.signupForm.get('phone')?.hasError('required')) {
      this.phoneError = "Le champ est requis."
      isValid = false
    }

    if(this.signupForm.get('zipcode')?.hasError('required')) {
      this.zipcodeError = "Le champ est requis."
      isValid = false
    }

    if(this.signupForm.get('address')?.hasError('required')) {
      this.addressError = "Le champ est requis."
      isValid = false
    }

    if(this.signupForm.get('city')?.hasError('required')) {
      this.cityError = "Le champ est requis."
      isValid = false
    }

    if(this.signupForm.get('country')?.hasError('required')) {
      this.countryError = "Le champ est requis."
      isValid = false
    }

    return isValid
  }

  closeSignup(): void {
    this.closeEmitter.emit()
  }

  onSubmit(): void {

    if(this.checkForm()) {
      const formData: UserSaveRequest = {
        email: this.signupForm.getRawValue()!.email!,
        login: this.signupForm.getRawValue()!.email!,
        password: this.signupForm.getRawValue().password1!,
        firstname: this.signupForm.getRawValue().firstname!,
        lastname: this.signupForm.getRawValue().lastname!,
        phone: this.signupForm.getRawValue().phone!,
        zipcode: this.signupForm.getRawValue().zipcode!,
        address: this.signupForm.getRawValue().address!,
        city: this.signupForm.getRawValue().city!,
        country: this.signupForm.getRawValue().country!
      }

      this.loginService.signup(formData).pipe(take(1)).subscribe({
        next:() => this.closeSignup(),
        error: () => this.notificationService.error("Une erreur s'est produite, nous n'avons pas pu créer votre compte.")
      })
      
      
    }

  }



  ngOnDestroy(): void {
     this.destroy$.next()
     this.destroy$.complete() 
  }

}
