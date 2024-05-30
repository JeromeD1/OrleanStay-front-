import { Component, Input, ChangeDetectionStrategy, output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Info } from '../../models/Info.model';
import { Appartment } from '../../models/Appartment.model';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

@Component({
  selector: 'app-plus-de-details',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './plus-de-details.component.html',
  styleUrl: './plus-de-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlusDeDetailsComponent {

  googleMapUrlSafe!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer){}

  @Input()
  googleMapUrl!: string;

  @Input()
  infos! : Info[];

  @Input()
  appartment!: Appartment;

  showMoreDetails = output<boolean>()


  //la fonction suivante fait partie du cycle de vie d'un composant angular et est appelée automatiquement
  //voici l'ordre des méthodes du cycle de vie d'un composant : constructor, ngOnChanges, ngOnInit, ngDoCheck, ngAfterContentInit, ngAfterContentChecked, ngAfterViewInit, ngAfterViewChecked, ngOnDestroy
  ngAfterViewInit(): void {
    this.googleMapUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.googleMapUrl);
    //la methode bypassSecurityTrustResourceUrl permet de marquer l'url comme sure
    //obligé de passer par là car angular bloque l'utilisation d'url dynamiques dans les iframes
  }


  closeMoreDetails(){
    this.showMoreDetails.emit(false);
  }

}
