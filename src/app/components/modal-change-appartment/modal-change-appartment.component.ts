import { Component, output } from '@angular/core';

@Component({
  selector: 'app-modal-change-appartment',
  standalone: true,
  imports: [],
  templateUrl: './modal-change-appartment.component.html',
  styleUrl: './modal-change-appartment.component.scss'
})
export class ModalChangeAppartmentComponent {

  cancelEmitter = output<void>()
  saveEmitter = output<void>()
  continueEmitter = output<void>()

  onCliCkCancel(): void {
    this.cancelEmitter.emit()
  }

  onClickSave(): void {
    this.saveEmitter.emit()
  }

  onClickContinue(): void {
    this.continueEmitter.emit()
  }
}
