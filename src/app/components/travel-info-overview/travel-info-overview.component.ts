import { Component, computed, input, OnInit, signal } from '@angular/core';
import { TravelInfo } from '../../models/TravelInfo.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-travel-info-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './travel-info-overview.component.html',
  styleUrl: './travel-info-overview.component.scss'
})
export class TravelInfoOverviewComponent implements OnInit {

  travelInfos = input.required<TravelInfo[]>()

  screenSize = signal<number>(400)

  maxImageWidth = computed<string>(() => {
    if(this.screenSize() > 450) {
      return "400px"
    } else {
      return Math.floor(0.85 * this.screenSize()) + "px"
    }
  })


  ngOnInit(): void {
      this.screenSize.set(window.innerWidth)      
  }

}
