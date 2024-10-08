import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextReservationInfoComponent } from './next-reservation-info.component';

describe('NextReservationInfoComponent', () => {
  let component: NextReservationInfoComponent;
  let fixture: ComponentFixture<NextReservationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextReservationInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NextReservationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
