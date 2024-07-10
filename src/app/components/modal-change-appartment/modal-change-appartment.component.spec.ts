import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChangeAppartmentComponent } from './modal-change-appartment.component';

describe('ModalChangeAppartmentComponent', () => {
  let component: ModalChangeAppartmentComponent;
  let fixture: ComponentFixture<ModalChangeAppartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalChangeAppartmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalChangeAppartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
