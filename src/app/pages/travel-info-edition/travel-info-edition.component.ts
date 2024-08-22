import { ChangeDetectorRef, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { NotificationService } from '../../shared/notification.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CloudinaryService } from '../../shared/cloudinary.service';
import { ScriptService } from '../../shared/script.service';
import { TravelInfo } from '../../models/TravelInfo.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { TravelInfoService } from '../../shared/travel-info.service';
import { environment } from '../../../environment/environment';
import { AppartmentsService } from '../../shared/appartments.service';
import { Appartment } from '../../models/Appartment.model';
import { TravelInfoOverviewComponent } from '../../components/travel-info-overview/travel-info-overview.component';

@Component({
  selector: 'app-travel-info-edition',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TravelInfoOverviewComponent],
  templateUrl: './travel-info-edition.component.html',
  styleUrl: './travel-info-edition.component.scss'
})
export class TravelInfoEditionComponent implements OnInit, OnDestroy {

  constructor(
    private readonly travelInfoService: TravelInfoService,
    private readonly appartmentService: AppartmentsService,
    private readonly notificationService: NotificationService, 
    private readonly fb: FormBuilder,
    private readonly cloudinaryService: CloudinaryService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef) {}

    /************Cloudinary *******************/
    cloudName = environment.CLOUD_NAME
    uploadPreset = environment.UPLOAD_PRESET
    apiKey = environment.api_key
    cloudinaryFolder = environment.cloudinaryFolder
  /************** *************************/


    travelInfos = signal<TravelInfo[]>([])
    appartmentId!: number 
    appartment = signal<Appartment | null>(null)

    positionOrderOptions: number[] = []
    destroy$: Subject<void> = new Subject()

    showOverview: boolean = false

    travelInfoForm = this.fb.group({
      infos: this.fb.array([])
    })


    ngOnInit(): void {
        this.getAppartmentId()
        this.getTravelInfos()
        this.initPositionOrder()
        // this.initForm()
    }

    getAppartmentId():void {
      const id = this.route.snapshot.paramMap.get("appartmentId")
      if(id){
        this.appartmentId = parseInt(id, 10)
        this.appartmentService.getAppartmentById(this.appartmentId).pipe(take(1)).subscribe({
          next: (data) => this.appartment.set(data)
        })
      }
    }

    getTravelInfos(): void {
      this.travelInfoService.getByAppartmentId(this.appartmentId).pipe(takeUntil(this.destroy$)).subscribe({
        next:(data) => {
          this.travelInfos.set(data)
          this.initForm()
          // this.initPositionOrder()
          console.log("travelInfos",this.travelInfos());
          this.cdr.detectChanges()
        },
        error: () => {
          this.notificationService.error("Une erreur est survenue lors de la récupération des données.")
        }
      })
    }

    initPositionOrder(): void {
      this.positionOrderOptions = this.travelInfos().map(item => item.positionOrder)
    }

    initForm(): void {
      this.infoArray.clear()
      this.initPositionOrder()
      console.log("initialisation", this.travelInfos());
      
      this.travelInfos().forEach(info => {
        this.addNewInfoInForm(info)
      });
      this.initEvents()
      this.cdr.detectChanges()
    }

    addNewInfoInForm(info: TravelInfo): void {
      const infoGroup = this.fb.group({
        id: [info.id],
        appartmentId: [info.appartmentId, Validators.required],
        positionOrder: [info.positionOrder, Validators.required],
        content: [info.content, Validators.required],
        contentType: [info.contentType, Validators.required]
      });
  
      this.infoArray.push(infoGroup);
    }

    initEvents(): void {
      this.infoArray.controls.forEach((control, index) => {
        if (control instanceof FormGroup) {
          const positionOrderControl = control.get('positionOrder');
          if (positionOrderControl) {
            positionOrderControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
              this.updateAllPositionOrder(control, value)  
            });
          }
        }
      });
    }


    addNewText(): void {
      const newText: TravelInfo = {
        appartmentId: this.appartmentId,
        positionOrder: this.travelInfos().length + 1,
        content: "",
        contentType: "TEXT"
      }

      this.travelInfoService.create(newText).pipe(take(1)).subscribe({
        next:(data) => {
          this.positionOrderOptions.push(this.travelInfos().length + 1)
          this.addNewInfoInForm(data)
          this.travelInfos.update(value => ([...value, data]))
          this.initEvents()
          this.cdr.detectChanges()
        },
        error:() => {
          this.notificationService.error("Erreur serveur, impossible de créer un nouveau texte pour le moment.")
        }
      })
    }


    autoSaveText(event: TravelInfo): void {
      this.travelInfoService.update(event).pipe(take(1)).subscribe({
        next:(data) => {
          this.travelInfos.update(value => value.map(item => (
            item.id === data.id ? data : item
          )))
        }
      })
    }

    /************Gestion des images **********************/
    addOrUpdateImage(url?: string): void {
      this.cloudinaryService.getCloudinarySignature(false).pipe(take(1)).subscribe(
        {
          next: (signatureData) => {
            (window as any).cloudinary.openUploadWidget(
              {
                cloudName: this.cloudName,
                apiKey: this.apiKey,
                uploadSignatureTimestamp: signatureData.timestamp,
                uploadSignature: signatureData.signature,
                clientAllowedFormats: ['image'],
                resourceType: 'image',
                source: "uw",
                folder: this.cloudinaryFolder
              },
              (error: any, result: any) => {
                if(url) {
                  this.processResultsAfterUpdatingPhoto(error, result, url)
                } else {
                  this.processResultsAfterAddingPhoto(error, result)
                }
              }
            );
          },
          error: () => {
            this.notificationService.error("Impossible d'obtenir une autorisation pour le telechargement de l'image.")
          }
        })
    }

    processResultsAfterAddingPhoto = (error: any, result: any): void => {
      if (result && result.event === 'success') {
        const secureUrl = result.info.secure_url;
        const previewUrl = secureUrl.replace('/upload/', '/upload/w_400/');
  
        //création d'une nouvelle travelInfo
        const newTravelInfo: TravelInfo = {
          appartmentId: this.appartmentId,
          positionOrder: this.travelInfos().length + 1,
          content: previewUrl,
          contentType: "IMG_URL"
        }
        this.travelInfoService.create(newTravelInfo).pipe(take(1)).subscribe(
          {
            next: (data) => {
              this.positionOrderOptions.push(this.travelInfos().length + 1)
              this.addNewInfoInForm(data)
              this.travelInfos.update(value => ([...value, data]))
              this.initEvents()
              this.cdr.detectChanges()
            },
            error: () => {
              this.notificationService.error("Une erreur s'est produite lors de l'enregistrement de la photo.")
              //TODO : Effacer la photo dans cloudinary
            }
          }
        )
      }
      if (error) {
        this.notificationService.error("Il y a eu une erreur lors du téléchargement de l'image.")
      }
    };
  
  
  
  
    processResultsAfterUpdatingPhoto = (error: any, result: any, oldUrl: string): void => {
      if (result && result.event === 'success') {
        const secureUrl = result.info.secure_url;
        const previewUrl = secureUrl.replace('/upload/', '/upload/w_400/');
  
        const oldTravelInfo: TravelInfo = this.infoArray.controls.find(control => control.get('content')?.value === oldUrl)?.getRawValue();
  
        const newTravelInfo: TravelInfo = {
          id: oldTravelInfo.id,
          appartmentId: this.appartmentId,
          positionOrder: this.travelInfos().length + 1,
          content: previewUrl,
          contentType: "IMG_URL"
        }
  
        //TODO : Appel de la fonction update du back
        this.travelInfoService.update(newTravelInfo, oldUrl).pipe(take(1)).subscribe({
          next: (data) => {
            this.travelInfos.update(value => value.map(item => (
              item.id === data.id ? data : item
            )))
            // modification de l'url de la photo dans le groupe
            const groupToChange: FormGroup = this.infoArray.controls.find(control => control.get("id")?.value === data.id) as FormGroup
            groupToChange.patchValue({
              content: data.content
            })
            this.cdr.detectChanges()
          },
          error: () => {
            this.notificationService.error("Une erreur s'est produite lors de l'enregistrement de l'image.")
          }
        })
        
      }
      if (error) {
        this.notificationService.error("Il y a eu une erreur lors du téléchargement de l'image.")
      }
    };

    /**************************** ********************************/




    deleteElement(event: TravelInfo) {
      this.travelInfoService.delete(event).subscribe({
        next: (data) => {
          this.travelInfos.set(data)
          this.initPositionOrder()
          this.initForm()
        }
      })
    }


    /*******Update de l'ordre des éléments ***************/
    updateAllPositionOrder(updatedControl: FormGroup, updatedPositionOrder: number): void{
      const initialPosition = this.travelInfos().find(item => item.id === updatedControl.get('id')?.value)?.positionOrder
  
      this.infoArray.controls.forEach((control) => {
        if (control instanceof FormGroup){
          if(control.value != updatedControl.value && initialPosition){
            const controlPositionOrder = control.get('positionOrder')!.value
            //Cas ou la nouvelle valeur est supérieure à l'ancienne
            if(updatedPositionOrder > initialPosition) {
              //les controls qui ont un positionOrder > initialPosition et inferieur ou egal à updatedPositionOrder baissent de 1
              if(controlPositionOrder > initialPosition && controlPositionOrder <= updatedPositionOrder ){
                control.get('positionOrder')?.setValue(controlPositionOrder - 1, {emitEvent: false})
              }
            } else {
              //Cas ou la nouvelle valeur est inférieure à l'ancienne
              if(controlPositionOrder >= updatedPositionOrder && controlPositionOrder < initialPosition){
                control.get('positionOrder')?.setValue(controlPositionOrder + 1, {emitEvent: false})
              }
            }
            //on récupère les nouvelles valeurs du formulaire pour les réinjecter dans initialPhotos
            this.travelInfos.set(this.infoArray.getRawValue())
          }
        }
      })
  
        //   // On trie le FormArray après avoir mis à jour toutes les positions
      this.sortPhotoArray();
      //on sauvegarde automatiquement l'ordre en bdd
      this.saveUpdatedOrder()
    }
  
    sortPhotoArray(): void {
      const sortedControls = this.infoArray.controls
        .slice()
        .sort((a, b) => {
          const posA = a.get('positionOrder')?.value;
          const posB = b.get('positionOrder')?.value;
          return posA - posB;
        });
  
      // Remplacez les contrôles dans le FormArray par les contrôles triés
      this.infoArray.clear();
      sortedControls.forEach(control => this.infoArray.push(control));

      //on met également à jour travelInfos
      this.travelInfos.set(this.infoArray.getRawValue())
    }

    saveUpdatedOrder(): void {
      const formData: TravelInfo[] = this.travelInfoForm.getRawValue().infos as TravelInfo[]
      this.travelInfoService.updateOrder(this.appartmentId, formData).pipe(take(1)).subscribe(
        {
          error: () => {
            this.notificationService.error("Attention, le nouvel ordre n'a pas pu être sauvegardé.")
          }
        }
      )
    }

/************* Boutons du header ************************* */
    goBackToGestion(): void {
      this.router.navigate(['/admin/appartGestion'])
    }

    openOverView(): void {
      this.showOverview = true
    }

    closeOverView(): void {
      this.showOverview = false
    }


    /***************** *************************/

    get infoArray():FormArray {
      return this.travelInfoForm.controls['infos'] as FormArray
    }

    ngOnDestroy(): void {
        this.destroy$.next()
        this.destroy$.complete()
    }
}
