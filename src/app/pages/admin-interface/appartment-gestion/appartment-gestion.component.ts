import { Component, OnDestroy, OnInit, ViewChild, WritableSignal, computed, signal } from '@angular/core';
import { User } from '../../../models/User.model';
import { AppstoreService } from '../../../shared/appstore.service';
import { AppartmentsService } from '../../../shared/appartments.service';
import { NotificationService } from '../../../shared/notification.service';
import { Appartment } from '../../../models/Appartment.model';
import { Subject, takeUntil, tap } from 'rxjs';
import { ReactiveFormsModule, } from '@angular/forms';
import { Discount } from '../../../models/Discount.model';
import { DiscountService } from '../../../shared/discount.service';
import { MatSelect, MatSelectModule} from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Owner } from '../../../models/Owner.model';
import { UtilisateurService } from '../../../shared/utilisateur.service';
import { UpdateAppartmentComponent } from '../../../components/update-appartment/update-appartment.component';
import { AppartmentSaveRequest } from '../../../models/Request/AppartmentSaveRequest.model';
import { ModalChangeAppartmentComponent } from '../../../components/modal-change-appartment/modal-change-appartment.component';
import { CreateAppartmentComponent } from '../../../components/create-appartment/create-appartment.component';
import { UpdateAppartmentPhotosComponent } from '../../../components/update-appartment-photos/update-appartment-photos.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-appartment-gestion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatOptionModule, MatFormFieldModule, UpdateAppartmentComponent, ModalChangeAppartmentComponent, CreateAppartmentComponent, UpdateAppartmentPhotosComponent, RouterModule],
  templateUrl: './appartment-gestion.component.html',
  styleUrl: './appartment-gestion.component.scss'
})
export class AppartmentGestionComponent implements OnInit, OnDestroy {

  constructor(
    private appstore: AppstoreService, 
    private appartmentService: AppartmentsService, 
    private notificationService: NotificationService, 
    private discountService: DiscountService, 
    private utilisateurService: UtilisateurService){}

  destroy$: Subject<void> = new Subject()
  currentUser: WritableSignal<User | null> = this.appstore.getCurrentUser()
  allAppartments: WritableSignal<Appartment[]> = this.appstore.getAllAppartments()
  selectedAppartment = signal<Appartment>(this.allAppartments()[0])
  discounts: WritableSignal<Discount[]> = this.appstore.getDiscounts()
  owners: WritableSignal<Owner[]> = this.appstore.getOwners()

  isAppartmentUpdating: boolean = false
  detectClickOnSelectAppartment = signal<number>(0)
  currentUpdatedAppartmentFormData = signal<AppartmentSaveRequest | null>(null)
  showModalBewareDataNotSave: boolean = false
  newAppartmentAfterSelectChange!: Appartment

  isInCreationAppartmentMode: boolean = false
  isPhotoOrderUptateToSave: boolean = false

  //signal permettant de vérifier que toutes les données sont collectées avant d'afficher des elements necessitant ces données
  isAllDataCollected = computed(() => {    
    return this.allAppartments().length > 0 && this.discounts().length > 0 && this.owners().length > 0 && this.selectedAppartment().id > 0
  })

  @ViewChild("matSelectAppartment") matSelectAppartment!: MatSelect

  ngOnInit(): void {
      this.getDiscounts()
      this.getOwners()
      this.getAppartments()
  }

  getDiscounts(): void {
    if(this.discounts().length === 0) {
      this.discountService.getDiscounts().pipe(takeUntil(this.destroy$)).subscribe(
        {
          error: (error) => this.notificationService.error(error)
        })
    }
  }

  getOwners(): void {
    if(this.owners().length === 0){
      this.utilisateurService.getAllOwners().pipe(takeUntil(this.destroy$)).subscribe(
        {
          error: () => {
            const meAsOwner: Owner = {
              id: this.appstore.getCurrentUser()()!.id,
              firstname: this.appstore.getCurrentUser()()!.personalInformations.firstname,
              lastname: this.appstore.getCurrentUser()()!.personalInformations.lastname
            }
            const newOwners: Owner[] = []
            newOwners.push(meAsOwner)
            this.appstore.setOwners(newOwners)
          }
        }
      )
    }
  }

  getAppartments(): void {    
    if(this.allAppartments().length === 0) {
      if(this.currentUser()?.role === "ADMIN") {
        this.appartmentService.getAllAppartments().pipe(takeUntil(this.destroy$)).subscribe(
          {
            next: () => {
              this.selectedAppartment.set(this.allAppartments()[0])
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
    this.newAppartmentAfterSelectChange = appartment
        
    if(this.isAppartmentUpdating) {
      this.showModalBewareDataNotSave = true
    } else {
      this.selectedAppartment.set(appartment)
    }
  }



  handleGetAppartmentUpdatingStatus(event: boolean): void {
    this.isAppartmentUpdating = event
  }

  //sauvegarde de l'appartment updated lors du click sur le bouton submit
  handleUpdateAppartment(appartmentSaveRequest: AppartmentSaveRequest) {    
    this.appartmentService.update(appartmentSaveRequest).subscribe(
      {
        next: (data) => {
          this.notificationService.success(`L'appartement ${appartmentSaveRequest.name} a bien été modifié`)
          //si on a sauvegardé via le bouton de sauvegarde normal, les valeurs de selectedAppartment ont changé, il faut donc 
          //lui réatribuer les bonnes valeurs afin que l'appartement apparaisse toujours dans le select          
          if(this.isAppartmentUpdating === true) {
            this.matSelectAppartment.writeValue(this.allAppartments().find(item => item.id === data.id))
          }
          //on ferme la modal d'avertissement au cas ou elle était ouverte
          this.showModalBewareDataNotSave = false
          //on déclare le formulaire comme n'étant plus en trai d'être updating
          this.isAppartmentUpdating = false
        },
        error: (error) => {
          this.notificationService.error("Les modifications n'ont pas pu être enregistrées en raison de données invalides.")
          this.showModalBewareDataNotSave = false
          this.selectedAppartment.set(this.allAppartments().find(item => item.id === appartmentSaveRequest.id)!)
          this.matSelectAppartment.writeValue(this.allAppartments().find(item => item.id === appartmentSaveRequest.id))
        }
      }
    )
    
  }

  //repérage du click sur le select appartment pour mettre dans une variable les données possiblement non sauvegardées
  handleClickOnSelectAppartment() {
    this.detectClickOnSelectAppartment.update(value => value + 1)
  }

  // mise dans une variable les données appartment possiblement non sauvegardées lors de l'update
  handleUpdateAppartmentSaveRequest(formData: AppartmentSaveRequest) {
    this.currentUpdatedAppartmentFormData.set(formData)    
  }

  /******Fonctions de validation de changement d'appartement lors du select ********/
  onClickSave(formData: AppartmentSaveRequest | null): void {    
    if(formData) {
      this.isAppartmentUpdating = false
      this.handleUpdateAppartment(formData)
    }
    this.selectedAppartment.set(this.newAppartmentAfterSelectChange)

  }

  onClickDontSave(): void {
    this.showModalBewareDataNotSave = false
    this.isAppartmentUpdating = false
    this.selectedAppartment.set(this.newAppartmentAfterSelectChange)
  }

  onClickContinue(): void {
    this.showModalBewareDataNotSave = false
    //on dit au select #matSelectAppartment de conserver l'ancienne valeur
    this.matSelectAppartment.writeValue(this.selectedAppartment())
  }

  /*********Fonctions liées à l'ajout d'appartement ************/
  passInCreationAppartmentMode(): void {
    this.isInCreationAppartmentMode = true
  }

  quitCreationAppartmentMode(): void {
    this.isInCreationAppartmentMode = false
  }

  createAppartment(formData : AppartmentSaveRequest): void {
    this.appartmentService.create(formData).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (data) => {
          this.quitCreationAppartmentMode()
          this.notificationService.success(`L'appartement ${formData.name} a bien été créé.`)
          this.selectedAppartment.set(this.allAppartments().find(appartment => appartment.id === data.id)!)
          this.matSelectAppartment.writeValue(this.allAppartments().find(appartment => appartment.id === data.id)!)
        },
        error: () => {
          this.notificationService.error(`Suite à un problème, l'appartement ${formData.name} n'a pas pu être créé.`)
        }
      }
    )
  }

  

  deleteAppartment(): void {
    this.appartmentService.delete(this.selectedAppartment().id).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: () => {
          this.notificationService.success(`L'appartement ${this.selectedAppartment().name} a bien été supprimé.`)
          this.selectedAppartment.set(this.allAppartments()[0])
          this.matSelectAppartment.writeValue(this.allAppartments()[0])
        }, 
        error: () => this.notificationService.error(`L'appartement ${this.selectedAppartment().name} n'a pas pu être supprimé.`)
      }
    )
  }


  updateSelectedAppartmentWhileChangingPhotoOrder(id: number): void {
    this.selectedAppartment.set(this.allAppartments().find(item => item.id === id)!)
  }

  setWarningOnPhotoOrderToSave(value: boolean): void {
    this.isPhotoOrderUptateToSave = value
  }

  showWarningNotificationForSavingPhotoOrder(): void {
    this.notificationService.error("Veuillez sauvegarder l'ordre des photos avant de changer d'appartement.")
  }

  ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
  }
}
