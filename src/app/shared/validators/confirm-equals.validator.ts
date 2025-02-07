import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidationErrors, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[confirmEqual]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: ConfirmEqualValidatorDirective, multi: true }]
})
export class ConfirmEqualValidatorDirective implements Validator {
  @Input('confirmEqual') controlNameToCompare: string = '';

  validate(control: AbstractControl): ValidationErrors | null {
    const controlToCompare = control.parent?.get(this.controlNameToCompare);
    if (control.value !== controlToCompare?.value) {
      return { confirmEqual: true };
    }
    return null;
  }
}
