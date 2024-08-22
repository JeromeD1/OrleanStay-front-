import { Component, input } from '@angular/core';
import { TravelInfo } from '../../models/TravelInfo.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-travel-info-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './travel-info-overview.component.html',
  styleUrl: './travel-info-overview.component.scss'
})
export class TravelInfoOverviewComponent {

  travelInfos = input.required<TravelInfo[]>()

}
