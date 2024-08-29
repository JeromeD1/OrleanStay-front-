import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReservationAdminComponent } from './edit-reservation-admin.component';

describe('EditReservationAdminComponent', () => {
  let component: EditReservationAdminComponent;
  let fixture: ComponentFixture<EditReservationAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditReservationAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditReservationAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
