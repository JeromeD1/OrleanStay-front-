import { ChangeDetectionStrategy, Component, computed, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { Appartment } from '../../models/Appartment.model';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Owner } from '../../models/Owner.model';
import { ReservationResearchRequest } from '../../models/Request/ReservationResearchRequest.model';
import { Subject, takeUntil } from 'rxjs';
import { ReactiveInputComponent } from '../../shared/library/reactive-input/reactive-input.component';
import { ReactiveSelectComponent } from '../../shared/library/reactive-select/reactive-select.component';
import { SomeFunctionsService } from '../../shared/some-functions.service';

@Component({
  selector: 'app-form-recherche-reservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ReactiveInputComponent, ReactiveSelectComponent],
  templateUrl: './form-recherche-reservation.component.html',
  styleUrl: './form-recherche-reservation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormRechercheReservationComponent implements OnInit, OnDestroy {

  constructor(private readonly fb: FormBuilder, private readonly someFunctions: SomeFunctionsService){}

  owners = input<Owner[] | null>()
  appartments = input.required<Appartment[]>()

  selectedOwnerId = signal<number | null>(null)

  ownersOptions = computed(() => {
    if(this.owners()){
      const options: {value: number | null, label: string}[] = []
      options.push({value: null, label: "---"})
    this.owners()!.forEach(item => {
      options.push({value: item.id, label: `${item.firstname} ${item.lastname}`
      })
    })
    return options
    } else {return []}
  })

  appartmentsOptions = computed(() => {
    const options: {value: number | null, label: string}[] = []
    options.push({value: null, label: "---"})
    if(this.selectedOwnerId()){
      this.appartments()!.filter(appart => appart.ownerId == this.selectedOwnerId()).forEach(item => {
        options.push({value: item.id, label: `${item.name}`
        })
      })
    } else {
      this.appartments()!.forEach(item => {
        options.push({value: item.id, label: `${item.name}`
        })
      })
    }
    return options
  })

  yearsOptions: {value: number | null, label: string}[] = [] 
  monthOptions: {value: number | null, label: string}[] = [] 
  stateOptions: {value: "accepted" | "notAccepted" | null, label: string}[] = [
    {value: null, label: "Toutes"},
    {value: "accepted", label: "Acceptée"},
    {value: "notAccepted", label: "Pas encore acceptée"}
  ]
  notClosedOptions: {value: boolean, label: string}[] = [
    {value: false, label: "Non"},
    {value: true, label: "Oui"},
  ]

  researchEmitter = output<ReservationResearchRequest>()

  formResearch: FormGroup = new FormGroup({})
  destroy$: Subject<void> = new Subject()

  ngOnInit(): void {
    this.yearsOptions = this.someFunctions.getYearsSelectOptions()
    this.monthOptions = this.someFunctions.getMonthSelectOptions()
      this.initForm()
      this.initEvents()
  }

  initForm(): void {
    this.formResearch = this.fb.group({
      ownerId: new FormControl<number | null>(null),
      appartmentId: new FormControl<number | null>(null),
      year: new FormControl<number | null>(null),
      month: new FormControl<number | null>(null),
      state: new FormControl<"accepted" | "notAccepted" | null>(null),
      notClosed: new FormControl<boolean>(false),
      //TODO plateform (quand ajouté dans objet reservation...)
    })

    this.formResearch.get("month")?.disable()
  }

  initEvents(): void {
    this.formResearch.get("year")?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if(value === "null") {value = null}

      if(value) {
        this.formResearch.get("month")?.enable()
      } else {
        this.formResearch.get("month")?.setValue(null)
        this.formResearch.get("month")?.disable()
      }
    })

    this.formResearch.get("ownerId")?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if(value === "null") {value = null}
      this.selectedOwnerId.set(value)
    })
  }
  
  

  resetForm(): void {
    this.formResearch.patchValue({
      ownerId: null,
      appartmentId: null,
      year: null,
      month: null,
      state: null,
      notClosed: false
    })
  }

  onSubmit(): void {
    this.researchEmitter.emit(this.formResearch.getRawValue())
    this.resetForm()
  }

  ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
  }
}
