import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TravelInfo } from '../../../models/TravelInfo.model';
import { TravelInfoOverviewComponent } from '../../../components/travel-info-overview/travel-info-overview.component';

@Component({
  selector: 'app-info-resa',
  standalone: true,
  imports: [TravelInfoOverviewComponent],
  templateUrl: './info-resa.component.html',
  styleUrl: './info-resa.component.scss'
})
export class InfoResaComponent implements OnInit{

  constructor(private readonly route: ActivatedRoute) {}

  travelInfos: TravelInfo[] = []

  ngOnInit(): void {
      this.travelInfos = this.route.snapshot.data["travelInfos"]
  }

}
