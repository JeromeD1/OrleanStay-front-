import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingGestionComponent } from './booking-gestion.component';

describe('BookingGestionComponent', () => {
  let component: BookingGestionComponent;
  let fixture: ComponentFixture<BookingGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingGestionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
