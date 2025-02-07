import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Optional, Self, SimpleChanges } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reactive-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reactive-select.component.html',
  styleUrl: './reactive-select.component.scss'
})
export class ReactiveSelectComponent implements ControlValueAccessor, OnInit {
  @Input() error: string | null = null;
  @Input() label: string = ""
  @Input() options: any[] = []
  @Input() optionValue: any
  @Input() optionLabelParts: any[] = []
  @Input() placeholder: string = ""

    value!: any;
    disabled = false;
    onChange: any = (value: any) => {};
    onTouched: any = () => {};

    ngOnInit(): void {
        this.addOptionLabelInOptions()
        this.addOptionValueInOptions()
    }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['options'] || changes['optionValue'] || changes['optionLabelParts']) {
        this.addOptionLabelInOptions();
        this.addOptionValueInOptions();
      }
    }

    addOptionLabelInOptions(): void {
      this.options.forEach(option => {
        let optionLabel = ""
        this.optionLabelParts.forEach(labelPart => {
          if(labelPart in option) {
            optionLabel += option[labelPart] + " "
          } else {
            optionLabel += labelPart + " "
          }
        })
        option.optionLabel = optionLabel.trim()
      })
    }

    addOptionValueInOptions(): void {
      this.options.forEach(option => {
        option.optionValue = option[this.optionValue]
      })
    }
	
    get control() {
    	return this.ngControl.control as AbstractControl;
    }

    constructor(@Optional() @Self() public ngControl: NgControl) {
      if (this.ngControl != null) {
       this.ngControl.valueAccessor = this;
      }
     }
     
     getChange(event: any) {
      this.onChange(event.target.value);
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
