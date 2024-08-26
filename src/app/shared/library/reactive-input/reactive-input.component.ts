import { Component, Input, Optional, Host, Self, forwardRef, Output, EventEmitter } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-reactive-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reactive-input.component.html',
  styleUrl: './reactive-input.component.scss',
})
export class ReactiveInputComponent implements ControlValueAccessor  {
  @Input() error: string | null = null;
  @Input() label: string = ""
  @Input() placeholder: string = ""
  @Input() type: string = "text"

    value!: any;
    disabled = false;
    onChange: any = (value: any) => {};
    onTouched: any = () => {};
	
    get control() {
    	return this.ngControl.control as AbstractControl;
    }

    constructor(@Optional() @Self() public ngControl: NgControl) {
      if (this.ngControl != null) {
       this.ngControl.valueAccessor = this;
      }
     }
     
     getChange(event: any) {
      const value = this.type === 'checkbox' ? event.target.checked : event.target.value;
      this.onChange(value);
      this.onTouched();
     }

     writeValue(val: any): void {
      this.value = val;
      this.onChange(val);
      this.onTouched(val);
     }

     registerOnChange(fn: any): void {
      this.onChange = fn;
     }

     registerOnTouched(fn: any): void {
      this.onTouched = fn;
     }

     setDisabledState(isDisabled: boolean): void {
      this.disabled = isDisabled;
     }
 
}