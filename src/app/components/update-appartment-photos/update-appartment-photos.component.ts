import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppartmentPhotosService } from '../../shared/appartment-photos.service';
import { Photo } from '../../models/Photo.model';
import { take } from 'rxjs';
import { NotificationService } from '../../shared/notification.service';

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
  formPhoto = this.fb.group({
    photos: this.fb.array([])
  })

  get photoArray():FormArray {
    return this.formPhoto.controls['photos'] as FormArray
  }

  isOrderModified = signal<boolean>(false)
  initialPhotos: Photo[] = []
  positionOrderOptions: number[] = []

  constructor(private readonly appartmentPhotosService: AppartmentPhotosService, private readonly fb: FormBuilder, private readonly notificationService: NotificationService) {}

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
      const photoGroup = this.fb.group({
        id: [photo.id],
        appartmentId: [photo.appartmentId, Validators.required],
        positionOrder: [photo.positionOrder, Validators.required],
        imgUrl: [photo.imgUrl, Validators.required]
      });
  
      this.photoArray.push(photoGroup);
    });
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
            console.log(this.formPhoto.getRawValue());
            
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
        },
        error: () => {
          this.notificationService.error("Une erreur s'est produite lors de l'enregistrement de l'ordre des photos.")
        }
      }
    )
  }


}
  
