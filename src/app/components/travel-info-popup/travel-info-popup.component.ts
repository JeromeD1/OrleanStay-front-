import { Component, input, output } from '@angular/core';
import { TravelInfoOverviewComponent } from '../travel-info-overview/travel-info-overview.component';
import { CommonModule } from '@angular/common';
import { TravelInfo } from '../../models/TravelInfo.model';

@Component({
  selector: 'app-travel-info-popup',
  standalone: true,
  imports: [TravelInfoOverviewComponent, CommonModule],
  templateUrl: './travel-info-popup.component.html',
  styleUrl: './travel-info-popup.component.scss'
})
export class TravelInfoPopupComponent {
  travelInfos = input.required<TravelInfo[]>()
  closeEmitter = output()

  close(): void {
    this.closeEmitter.emit()
  }
}
