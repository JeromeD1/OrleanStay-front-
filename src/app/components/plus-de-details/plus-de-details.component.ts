import { Component, Input, ChangeDetectionStrategy, output, input, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Info } from '../../models/Info.model';
import { Appartment } from '../../models/Appartment.model';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatExpansionModule} from '@angular/material/expansion';
import { AvisSimpleDisplayComponent } from '../avis-simple-display/avis-simple-display.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Feedback } from '../../models/Feedback.model';

@Component({
  selector: 'app-plus-de-details',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe, MatPaginatorModule, MatExpansionModule, MatTableModule, AvisSimpleDisplayComponent],
  templateUrl: './plus-de-details.component.html',
  styleUrl: './plus-de-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlusDeDetailsComponent {

  googleMapUrlSafe!: SafeResourceUrl;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private sanitizer: DomSanitizer){}

  @Input()
  googleMapUrl!: string; //ne fonctionne pas en le passant en input signal

  infos = input.required<Info[]>()
  appartment = input.required<Appartment>()

  showMoreDetails = output<boolean>()

  displayedColumns: string[] = ['feedback'];
  dataSource = new MatTableDataSource<Feedback>([]);


  //la fonction suivante fait partie du cycle de vie d'un composant angular et est appelée automatiquement
  //voici l'ordre des méthodes du cycle de vie d'un composant : constructor, ngOnChanges, ngOnInit, ngDoCheck, ngAfterContentInit, ngAfterContentChecked, ngAfterViewInit, ngAfterViewChecked, ngOnDestroy
  ngAfterViewInit(): void {
    this.googleMapUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.googleMapUrl);
    //la methode bypassSecurityTrustResourceUrl permet de marquer l'url comme sure
    //obligé de passer par là car angular bloque l'utilisation d'url dynamiques dans les iframes
    if(this.appartment().comments) {
      this.dataSource = new MatTableDataSource<Feedback>(this.appartment().comments.sort((a,b) => b.id! - a.id!));
      this.dataSource.paginator = this.paginator;
    }
  }


  closeMoreDetails(){
    this.showMoreDetails.emit(false);
  }

}
