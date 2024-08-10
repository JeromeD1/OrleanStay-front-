import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, input, OnChanges, OnInit, output, signal, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppartmentPhotosService } from '../../shared/appartment-photos.service';
import { Photo } from '../../models/Photo.model';
import { take } from 'rxjs';
import { NotificationService } from '../../shared/notification.service';
import { environment } from '../../../environment/environment';
import { ScriptService } from '../../shared/script.service';

@Component({
  selector: 'app-update-appartment-photos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-appartment-photos.component.html',
  styleUrl: './update-appartment-photos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateAppartmentPhotosComponent implements OnInit, OnChanges{

  photos = input.required<Photo[]>()

  updateOrderEmitter = output<number>() //sert à envoyer l'id de l'appartement mis à jour pour mettre à jour selectedAppartment dans le parent
  warningChangeOrderEmitter = output<boolean>()

  formPhoto = this.fb.group({
    photos: this.fb.array([])
  })

  get photoArray():FormArray {
    return this.formPhoto.controls['photos'] as FormArray
  }

  isOrderModified = signal<boolean>(false)
  initialPhotos: Photo[] = []
  positionOrderOptions: number[] = []

  constructor(
    private readonly appartmentPhotosService: AppartmentPhotosService, 
    private readonly fb: FormBuilder, 
    private readonly notificationService: NotificationService,
    private scriptService: ScriptService) {
      this.scriptService.load('uw');
    }

  ngOnInit(): void {
    this.initialPhotos = this.photos()
    this.positionOrderOptions = this.photos().map(item => item.positionOrder)
      this.initForm()
      this.initEvents()
  }

  //détecttion du changement de sélection d'appartement et réinitialisation du formulaire
  ngOnChanges(changes: SimpleChanges): void {
      if(changes['photos']) {
        this.initForm()
        this.initEvents()
      }
  }

  initForm(): void {
    this.photoArray.clear() // on vide le formArray pour le cas ou l'utilisateur change d'appartement

    this.photos().forEach((photo) => {
      this.addNewPhotoInForm(photo)
      // const photoGroup = this.fb.group({
      //   id: [photo.id],
      //   appartmentId: [photo.appartmentId, Validators.required],
      //   positionOrder: [photo.positionOrder, Validators.required],
      //   imgUrl: [photo.imgUrl, Validators.required]
      // });
  
      // this.photoArray.push(photoGroup);
    });
  }

  addNewPhotoInForm(photo: Photo): void {
    const photoGroup = this.fb.group({
      id: [photo.id],
      appartmentId: [photo.appartmentId, Validators.required],
      positionOrder: [photo.positionOrder, Validators.required],
      imgUrl: [photo.imgUrl, Validators.required]
    });

    this.photoArray.push(photoGroup);
  }

  /************************************ */
  initEvents(): void {
    this.photoArray.controls.forEach((control, index) => {
      if (control instanceof FormGroup) {
        const positionOrderControl = control.get('positionOrder');
        if (positionOrderControl) {
          positionOrderControl.valueChanges.subscribe((value) => {
            this.isOrderModified.set(true)
            this.updateAllPositionOrder(control, value)
            
            this.warningChangeOrderEmitter.emit(true)
            
          });
        }
      }
    });
  }


  updateAllPositionOrder(updatedControl: FormGroup, updatedPositionOrder: number): void{
    const initialPosition = this.initialPhotos.find(item => item.id === updatedControl.get('id')?.value)?.positionOrder

    this.photoArray.controls.forEach((control) => {
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
          this.initialPhotos = this.photoArray.getRawValue()
        }
      }
    })

      //   // On trie le FormArray après avoir mis à jour toutes les positions
    this.sortPhotoArray();
  }

  sortPhotoArray(): void {
    const sortedControls = this.photoArray.controls
      .slice()
      .sort((a, b) => {
        const posA = a.get('positionOrder')?.value;
        const posB = b.get('positionOrder')?.value;
        return posA - posB;
      });

    // Remplacez les contrôles dans le FormArray par les contrôles triés
    this.photoArray.clear();
    sortedControls.forEach(control => this.photoArray.push(control));
  }

  saveUpdatedOrder(): void {
    const formData: Photo[] = this.formPhoto.getRawValue().photos as Photo[]
    this.appartmentPhotosService.updateOrder(formData).pipe(take(1)).subscribe(
      {
        next: () => {
          this.notificationService.success("L'ordre des photos a bien été sauvegardé.")
          this.isOrderModified.set(false)
          this.updateOrderEmitter.emit(this.photos()[0].appartmentId)
          this.warningChangeOrderEmitter.emit(false)
        },
        error: () => {
          this.notificationService.error("Une erreur s'est produite lors de l'enregistrement de l'ordre des photos.")
        }
      }
    )
  }


  /************Cloudinary *******************/
  uploadedImage = '';
  isDisabled = false;
  uploadedImages: string[] = [];



  processResults = (error: any, result: any): void => {
    if (result.event === 'close') {
      this.isDisabled = false;
    }
    if (result && result.event === 'success') {
      const secureUrl = result.info.secure_url;
      const previewUrl = secureUrl.replace('/upload/', '/upload/w_400/');
      this.uploadedImages.push(previewUrl);
      console.log("previewUrl", previewUrl);
      //ajout d'une position dans positionOrderOptions
      this.positionOrderOptions.push(this.photos().length + 1)
      //création d'une nouvelle photo
      const newPhoto: Photo = {
        appartmentId: this.photos()[0].appartmentId,
        positionOrder: this.photos().length + 1,
        imgUrl: previewUrl
      }
      this.appartmentPhotosService.create(newPhoto).pipe(take(1)).subscribe(
        {
          next: (data) => {
            this.updateOrderEmitter.emit(this.photos()[0].appartmentId) //pour la mise à jour de l'appartement dans le parent
            console.log("updated photos",this.photos());
            //TODO : ajouter un nouveau formGroup
            const photoToAdd: Photo = data.find(item => item.imgUrl === newPhoto.imgUrl && item.positionOrder === newPhoto.positionOrder)!
            this.addNewPhotoInForm(photoToAdd)
            
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

  cloudName = environment.CLOUD_NAME;
  uploadPreset = environment.UPLOAD_PRESET;

  uploadWidget = (): void => {
    this.isDisabled = true;
    (window as any).cloudinary.openUploadWidget(
      {
        cloudName: this.cloudName,
        uploadPreset: this.uploadPreset,
        sources: ['local', 'url'],
        tags: ['myphotoalbum-angular'],
        clientAllowedFormats: ['image'],
        resourceType: 'image',
      },
      this.processResults
    );
  };


}
  
