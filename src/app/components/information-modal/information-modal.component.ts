import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-information-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './information-modal.component.html',
  styleUrl: './information-modal.component.scss'
})
export class InformationModalComponent {

  title = input.required<string>()
  messages = input.required<string[]>()
  confirmButtonText = input.required<string>()
  cancelButtonText = input<string>()

  cancelEmitter = output<void>()
  confirmEmitter = output<void>()

  cancel(): void {
    this.cancelEmitter.emit()
  }

  confirm(): void {
    this.confirmEmitter.emit()
  }
}
