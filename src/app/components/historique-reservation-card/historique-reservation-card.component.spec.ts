import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueReservationCardComponent } from './historique-reservation-card.component';

describe('HistoriqueReservationCardComponent', () => {
  let component: HistoriqueReservationCardComponent;
  let fixture: ComponentFixture<HistoriqueReservationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriqueReservationCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoriqueReservationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
