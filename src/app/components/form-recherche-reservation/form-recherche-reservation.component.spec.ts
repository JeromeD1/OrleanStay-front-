import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRechercheReservationComponent } from './form-recherche-reservation.component';

describe('FormRechercheReservationComponent', () => {
  let component: FormRechercheReservationComponent;
  let fixture: ComponentFixture<FormRechercheReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormRechercheReservationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormRechercheReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
