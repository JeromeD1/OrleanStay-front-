import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { Appartment } from '../../models/Appartment.model';
import { SomeFunctionsService } from '../../shared/some-functions.service';
import { Traveller } from '../../models/Traveller.model';
import { Reservation } from '../../models/Reservation.model';
import { CommonModule } from '@angular/common';
import { PlusDeDetailsComponent } from '../plus-de-details/plus-de-details.component';

@Component({
  selector: 'app-appartment-card',
  standalone: true,
  imports: [CommonModule, PlusDeDetailsComponent],
  templateUrl: './appartment-card.component.html',
  styleUrl: './appartment-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppartmentCardComponent {
  constructor(private someFunctionService: SomeFunctionsService){}

  @Input()
  appartment!: Appartment;

  @Input()
  appartments!:Appartment[];

  @Input()
  traveller!: Traveller

  @Input()
  userReservation!: Reservation

  index: number = 0;

  showMoreDetails:boolean = false;
  showToutesDispo: boolean = false;
  showDemandeResa: boolean = false;
  get travelPrice(): number | null {
    return this.someFunctionService.getTravelPrice(this.userReservation,this.appartment);
  };
  get nightPrice():number {
    return this.someFunctionService.getNightPrice(this.userReservation, this.appartment);
  }
  get numberOfDays(): number | null{
    return this.someFunctionService.getNumberOfDays(this.userReservation);
  }


  changeShowMoreDetails() {
    this.showMoreDetails = !this.showMoreDetails;
  }

  changeShowToutesDispo() {
    this.showToutesDispo = !this.showToutesDispo;
  }

  changeShowDemandeResa() {
    this.showDemandeResa = !this.showDemandeResa;
  }

  nextPhoto():void {
    if(this.index < this.appartment.photos.length -1) {
      this.index++;
    }
  }

  previousPhoto():void {
    if(this.index > 0) {
      this.index--;
    }
  }


  getNightPrice(): number {

    const numberOfTraveller = this.userReservation.nbAdult + this.userReservation.nbChild;
    if(this.userReservation.nbAdult > 0 && numberOfTraveller > 2) {
        const newNightPrice = this.appartment.nightPrice + 10 * (numberOfTraveller - 2);
        return newNightPrice;
      }
     else {
      return this.appartment.nightPrice;
    }
  }

  getNumberOfDays(): number | null {
    if(this.userReservation.checkinDate && this.userReservation.checkoutDate) {
      return (this.userReservation.checkoutDate.getTime() - this.userReservation.checkinDate.getTime()) / (1000 * 3600 * 24); //(checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 3600 * 24)
    } else {
      return null;
    }
  }


  //--------------------------------
  //---Pour dimensionner correctement mes images, même si elles sont à la verticale
@ViewChild('caroussel') caroussel: ElementRef | undefined; // on ajoute undefined pour que caroussel n'ait pas besoin d'être initialisé (sinon : erreur)
// obligé de mettre | undefined car caroussel est initialisé lors du chargement du template

@ViewChild('imgCaroussel') imgCaroussel: ElementRef | undefined;

@HostListener('window:resize', ['$event'])
onResize(event: any) {
  this.setWithAndHeight();
}

ngAfterViewInit(): void {
    this.setWithAndHeight();
}

setWithAndHeight() {
  if(this.caroussel && this.imgCaroussel){ // on rajoute cette condition car caroussel peut être undefined d'après sa déclaration
    const carousselWidth = this.caroussel.nativeElement.offsetWidth;
    const imgCarousselWidth = this.imgCaroussel.nativeElement.offsetWidth;
    const imgCarousselHeight = this.imgCaroussel.nativeElement.offsetHeight;
    const carousselHeight = (3/4) * carousselWidth;
    this.caroussel.nativeElement.style.height = carousselHeight + "px";

    if(imgCarousselWidth > imgCarousselHeight) {
      this.imgCaroussel.nativeElement.style.width = carousselWidth + "px";
      this.imgCaroussel.nativeElement.style.height = carousselHeight + "px";
    } else {
      this.imgCaroussel.nativeElement.style.width = carousselHeight + "px";
      this.imgCaroussel.nativeElement.style.height = "auto";
    }
  }
}


  //----------------------------------
}
