import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TravellerNumbers } from '../../models/TravellerNumbers.model';


@Component({
  selector: 'app-choose-voyagers',
  standalone: true,
  imports: [],
  templateUrl: './choose-voyagers.component.html',
  styleUrl: './choose-voyagers.component.scss'
})
export class ChooseVoyagersComponent {

  @Input()
travellerNumbers!: TravellerNumbers;

@Output()
travellerUpdate: EventEmitter<TravellerNumbers>  = new EventEmitter();


addAdult(): void {
  this.travellerNumbers = {...this.travellerNumbers, numberAdult: this.travellerNumbers.numberAdult + 1 };
  this.updateVoyagers();
}

removeAdult() : void {
  this.travellerNumbers = {...this.travellerNumbers, numberAdult: this.travellerNumbers.numberAdult - 1 };
  this.updateVoyagers();
}

addChild(): void {
  this.travellerNumbers = {...this.travellerNumbers, numberChild: this.travellerNumbers.numberChild + 1 };
  this.updateVoyagers();
}

removeChild(): void {
  this.travellerNumbers = {...this.travellerNumbers, numberChild: this.travellerNumbers.numberChild - 1 };
  this.updateVoyagers();
}

addBaby(): void {
  this.travellerNumbers = {...this.travellerNumbers, numberBaby: this.travellerNumbers.numberBaby + 1 };
  this.updateVoyagers();
}

removeBaby() : void {
  this.travellerNumbers = {...this.travellerNumbers, numberBaby: this.travellerNumbers.numberBaby - 1 };
  this.updateVoyagers();
}

updateVoyagers(): void {
this.travellerUpdate.emit(this.travellerNumbers);
}

}
