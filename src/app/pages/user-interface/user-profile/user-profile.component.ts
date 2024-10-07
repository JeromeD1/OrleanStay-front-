import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild, WritableSignal } from '@angular/core';
import { User } from '../../../models/User.model';
import { AppstoreService } from '../../../shared/appstore.service';
import { Subject, take, takeUntil } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuComponent } from '../../../components/menu/menu.component';
import { UserSaveRequest } from '../../../models/Request/UserSaveRequest.model';
import { PersonalInformation } from '../../../models/PersonalInformation.model';
import { UtilisateurService } from '../../../shared/utilisateur.service';
import { NotificationService } from '../../../shared/notification.service';
import { ChangePasswordSaveRequest } from '../../../models/Request/ChangePasswordSaveRequest.model';
import { ReactiveInputComponent } from '../../../shared/library/reactive-input/reactive-input.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, MenuComponent, ReactiveFormsModule, ReactiveInputComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements AfterViewInit {

  constructor(
    private readonly appstore: AppstoreService, 
    private readonly fb: FormBuilder,
    private readonly utilisateurService: UtilisateurService,
    private readonly notificationService: NotificationService
  ){}

  @ViewChild('imgCathedraleElement') imgCathedraleElement: ElementRef = {} as ElementRef
  @ViewChild('formContainerElement') formContainerElement: ElementRef = {} as ElementRef

  imgCathedrale: string = "../assets/global-pictures/cathedrale-orleans.jpg"
  iconMenu: string = "../assets/icons/icons-menu-noir.png"
  showMenu: boolean = false

  currentUser: WritableSignal<User | null> = this.appstore.getCurrentUser()

  destroy$: Subject<void> = new Subject()

  emailError: string | null = null
  oldPasswordError: string | null = null
  newPasswordError: string | null = null
  confirmationPasswordError: string | null = null
  firstnameError: string | null = null
  lastnameError: string | null = null
  phoneError: string | null = null
  zipcodeError: string | null = null
  addressError: string | null = null
  cityError: string | null = null
  countryError: string | null = null

  personalInfoForm = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    firstname: ["", Validators.required],
    lastname: ["", Validators.required],
    phone: ["", Validators.required],
    zipcode: ["", Validators.required],
    address: ["", Validators.required],
    city: ["", Validators.required],
    country: ["", Validators.required]
  })

  passwordForm = this.fb.group({
    oldPassword: ["", Validators.required],
    newPassword: ["", Validators.required],
    confirmationPassword: ["", Validators.required]
  })

  ngOnInit(): void {
      this.initForm()
      this.initEvent()
  }

  ngAfterViewInit(): void {
    const formHeight = this.formContainerElement.nativeElement.offsetHeight;
    this.imgCathedraleElement.nativeElement.style.minHeight = `${formHeight}px`;
  }

  initForm(): void {
    if(this.currentUser()){
      this.personalInfoForm.patchValue({
        email: this.currentUser()?.personalInformations.email,
        firstname: this.currentUser()?.personalInformations.firstname,
        lastname: this.currentUser()?.personalInformations.lastname,
        phone: this.currentUser()?.personalInformations.phone,
        zipcode: this.currentUser()?.personalInformations.zipcode,
        address: this.currentUser()?.personalInformations.address,
        city: this.currentUser()?.personalInformations.city,
        country: this.currentUser()?.personalInformations.country
      })
    }
  }

  resetPasswordForm(): void {
    this.passwordForm.patchValue({
      oldPassword: "",
      newPassword: "",
      confirmationPassword: ""
    })
  }

  initEvent(): void {
    this.personalInfoForm.get('email')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if(!this.personalInfoForm.get('email')?.hasError('email')){
        this.emailError = null
      }
    })

    this.personalInfoForm.get('firstname')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if(value !== ""){
        this.firstnameError = null
      }
    })

    this.personalInfoForm.get('lastname')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if(value !== ""){
        this.firstnameError = null
      }
    })

    this.personalInfoForm.get('phone')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if(value !== ""){
        this.firstnameError = null
      }
    })

    this.personalInfoForm.get('zipcode')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if(value !== ""){
        this.firstnameError = null
      }
    })

    this.personalInfoForm.get('address')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if(value !== ""){
        this.firstnameError = null
      }
    })

    this.personalInfoForm.get('city')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if(value !== ""){
        this.firstnameError = null
      }
    })

    this.personalInfoForm.get('country')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if(value !== ""){
        this.firstnameError = null
      }
    })

    this.passwordForm.get('oldPassword')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if(value && value.length >= 8){
        this.oldPasswordError = null
      }
    })

    this.passwordForm.get('newPassword')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if(value && value.length >= 8){
        this.newPasswordError = null
      }
    })

    this.passwordForm.get('confirmationPassword')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      const newPassword = this.passwordForm.get('newPassword')?.value
      if(value === newPassword){
        this.confirmationPasswordError = null
      }
    })
  }

  checkPersonalInformationForm(): boolean {
    let isValid = true

    if(this.personalInfoForm.get('email')?.hasError('email')) {
      this.emailError = "L'email doit être valide."
      isValid = false
    }

    if(this.personalInfoForm.get('email')?.hasError('required')) {
      this.emailError = "Le champ est requis."
      isValid = false
    }

    if(this.personalInfoForm.get('firstname')?.hasError('required')) {
      this.firstnameError = "Le champ est requis."
      isValid = false
    }

    if(this.personalInfoForm.get('lastname')?.hasError('required')) {
      this.lastnameError = "Le champ est requis."
      isValid = false
    }

    if(this.personalInfoForm.get('phone')?.hasError('required')) {
      this.phoneError = "Le champ est requis."
      isValid = false
    }

    if(this.personalInfoForm.get('zipcode')?.hasError('required')) {
      this.zipcodeError = "Le champ est requis."
      isValid = false
    }

    if(this.personalInfoForm.get('address')?.hasError('required')) {
      this.addressError = "Le champ est requis."
      isValid = false
    }

    if(this.personalInfoForm.get('city')?.hasError('required')) {
      this.cityError = "Le champ est requis."
      isValid = false
    }

    if(this.personalInfoForm.get('country')?.hasError('required')) {
      this.countryError = "Le champ est requis."
      isValid = false
    }

    return isValid
  }

  checkPasswordForm(): boolean {
    let isValid = true

    if(this.passwordForm.get('oldPassword')!.value!.length < 8) {
      this.oldPasswordError = "Le mot de passe doit contenir au moins 8 caractères."
      isValid = false
    }

    if(this.passwordForm.get('oldPassword')?.hasError('required')) {
      this.oldPasswordError = "Le champ est requis."
      isValid = false
    }

    if(this.passwordForm.get('newPassword')!.value!.length < 8) {
      this.newPasswordError = "Le mot de passe doit contenir au moins 8 caractères."
      isValid = false
    }

    if(this.passwordForm.get('newPassword')?.hasError('required')) {
      this.newPasswordError = "Le champ est requis."
      isValid = false
    }

    if(this.passwordForm.get('confirmationPassword')?.value !== this.passwordForm.get('newPassword')?.value) {
      this.confirmationPasswordError = "Les deux mots de passes doivent être identiques."
      isValid = false
    }

    if(this.passwordForm.get('confirmationPassword')?.hasError('required')) {
      this.confirmationPasswordError = "Le champ est requis."
      isValid = false
    }

    return isValid
  }


  onSubmitPersonalInfo(): void {

    if(this.checkPersonalInformationForm()) {
      const formData: PersonalInformation = {
        id: this.currentUser()?.personalInformations.id,
        email: this.personalInfoForm.getRawValue()!.email!,
        firstname: this.personalInfoForm.getRawValue().firstname!,
        lastname: this.personalInfoForm.getRawValue().lastname!,
        phone: this.personalInfoForm.getRawValue().phone!,
        zipcode: this.personalInfoForm.getRawValue().zipcode!,
        address: this.personalInfoForm.getRawValue().address!,
        city: this.personalInfoForm.getRawValue().city!,
        country: this.personalInfoForm.getRawValue().country!
      }

      this.utilisateurService.updatePersonalInformation(formData).pipe(take(1)).subscribe({
        next:() => this.notificationService.success("Vos informations personnelles ont été mises à jour."),
        error: () => this.notificationService.error("Une erreur s'est produite lors de l'enregistrement de vos nouvelles informations personnelles.")
      })
      
    }
  }

  onSubmitPasswordForm(): void {
    if(this.checkPasswordForm()){
      const formData: ChangePasswordSaveRequest = {
        oldPassword: this.passwordForm.getRawValue().oldPassword!,
        newPassword: this.passwordForm.getRawValue().newPassword!,
        confirmationPassword: this.passwordForm.getRawValue().confirmationPassword!
      }

      if(this.currentUser() && this.currentUser()?.id) {
        this.utilisateurService.updateUserPassword(formData, this.currentUser()?.id!).pipe(take(1)).subscribe(
          {
            next: () => {
              this.notificationService.success("Votre mot de passe a bien été mis à jour.")
              this.resetPasswordForm()
            },
            error: () => this.notificationService.error("Une erreur est survenue lors de l'enregistrement de la modification de votre mot de passe.")
          }
        )
      }
    }
  }


    openMenu(): void {
      this.showMenu = true
    }
  
    closeMenu(): void {
      this.showMenu = false
    }


  ngOnDestroy(): void {
     this.destroy$.next()
     this.destroy$.complete() 
  }
}
