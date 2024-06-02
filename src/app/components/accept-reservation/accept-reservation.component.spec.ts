import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptReservationComponent } from './accept-reservation.component';

describe('AcceptReservationComponent', () => {
  let component: AcceptReservationComponent;
  let fixture: ComponentFixture<AcceptReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptReservationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcceptReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
