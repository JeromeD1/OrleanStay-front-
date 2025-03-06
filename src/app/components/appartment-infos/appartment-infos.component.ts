import { ChangeDetectionStrategy, ChangeDetectorRef, Component, input, OnChanges, OnInit, output, signal, SimpleChanges } from '@angular/core';
import { Info } from '../../models/Info.model';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';
import { AppartmentInfoService } from '../../shared/appartment-info.service';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-appartment-infos',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './appartment-infos.component.html',
  styleUrl: './appartment-infos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppartmentInfosComponent implements OnInit, OnChanges {
  initialInfos = input.required<Info[]>()
  appartmentId = input.required<number>()

  updateEmitter = output<number>()

  updatedInfos = signal<Info[]>([])

  positionOrderOptions: number[] = []

  formInfos = this.fb.group({
    infos: this.fb.array([])
  })

  constructor(
    private readonly fb: FormBuilder,
    private readonly appartmentInfoService: AppartmentInfoService,
    private readonly notificationService: NotificationService,
    private readonly cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
      this.updatedInfos.set(this.initialInfos())

      this.initPositionOrder()
      this.initForm()
  }

  //détecttion du changement de sélection d'appartement et réinitialisation du formulaire
  ngOnChanges(changes: SimpleChanges): void {
      if(changes['initialInfos']) {
        this.updatedInfos.set(this.initialInfos())
        this.initPositionOrder()
        this.initForm()
        this.sortInfoArray()
      }
  }

  initPositionOrder(): void {
    this.positionOrderOptions = this.initialInfos().map(item => item.positionOrder)
  }

  private initForm() {
    this.infoArray.clear()
    
    this.initialInfos().forEach(info => {
      this.addExistingInfoInForm(info)
    });
  }

  addExistingInfoInForm(info: Info): void {
    const infoGroup = this.fb.group({
      id: [info.id],
      appartmentId: [info.appartmentId, Validators.required],
      positionOrder: [info.positionOrder, Validators.required],
      info: [info.info, Validators.required]
    });

    this.infoArray.push(infoGroup);
  }

  addNewInfoInForm(): void {
    this.addOrRemovePositionOrderOption(true)

    const infoGroup = this.fb.group({
      id: this.setTemporaryId(),
      appartmentId: [this.appartmentId(), Validators.required],
      positionOrder: [this.getMaxPositionOrder(), Validators.required],
      info: ["", Validators.required]
    });

    this.infoArray.push(infoGroup);
    
    this.updatedInfos.set(this.formInfos.get("infos")?.value as Info[])
  }

  getMaxPositionOrder(): number {
    if(!this.positionOrderOptions.length){
      return 0
    }
    return Math.max(...this.positionOrderOptions)
  }

  setTemporaryId(): number {
    const currentInfosInForm = this.formInfos.get("infos")?.value as Info[]
    
    if(!currentInfosInForm.length) {
      return -1
    } else {
      let idList: number[] = [] 
      currentInfosInForm.forEach((item: Info) => {
        if(item.id && item.id < 0) {
          idList.push(item.id)
        }
      })
  
      return !idList.length ? -1 : Math.min(...idList) - 1
    }
  }

  addOrRemovePositionOrderOption(shouldAdd: boolean) {
    if (shouldAdd) {
      this.positionOrderOptions.push(this.getMaxPositionOrder() + 1)
    } else {
      this.positionOrderOptions.pop()
    }
  }
  
     /*******Update de l'ordre des éléments ***************/
     updateAllPositionOrder(updatedControl: Info): void{
      const updatedPositionOrder = updatedControl.positionOrder
      const initialPosition = this.updatedInfos().find(item => item.id === updatedControl.id)?.positionOrder
      const newInfos = this.updatedInfos()

      newInfos.forEach(info => {
        if(info.id === updatedControl.id) {
          info.positionOrder = updatedPositionOrder
        } else if(initialPosition) {
          if(updatedPositionOrder > initialPosition) {
            if(info.positionOrder > initialPosition && info.positionOrder <= updatedPositionOrder) {
              info.positionOrder--
            } 
          } else if(info.positionOrder >= updatedPositionOrder && info.positionOrder < initialPosition) {
            //Cas ou la nouvelle valeur est inférieure à l'ancienne
            info.positionOrder++
          }
        }
      })

      this.updatedInfos.set(newInfos) 
      this.saveAndUpdateForm()
    }
  
    sortInfoArray(): void {
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
      this.updatedInfos.set(this.infoArray.getRawValue())
    }


    deleteInfo(infoToDelete: Info) {
      const newInfos: Info[] = this.updatedInfos()
      .filter(item => item.id !== infoToDelete.id)
      .map((item => (
        item.positionOrder > infoToDelete.positionOrder ? {...item, positionOrder: item.positionOrder - 1} : item
      )))
      this.updatedInfos.set(newInfos)
      
      this.saveAndUpdateForm()
    }

  updateAppartmentInfos() {
    this.updatedInfos.set(this.formInfos.get("infos")?.value as Info[])
    this.saveAndUpdateForm()
  }

  saveAndUpdateForm() {
    const infosToSave: Info[] = this.updatedInfos().map(item =>(
      item.id && item.id > 0 ? item : {...item, id: undefined}
    ))
    this.appartmentInfoService.updateAppartmentInfos(this.appartmentId(), infosToSave).pipe(take(1)).subscribe(
      {
        next:() => {
        this.updateEmitter.emit(this.appartmentId())
        },
        error: () => {
          this.notificationService.error("Une erreur s'est produite, les modifications n'ont pas pu être sauvegardées.")
        }
      }
    )
  }

  get infoArray():FormArray {
      return this.formInfos.controls['infos'] as FormArray
  }
}
