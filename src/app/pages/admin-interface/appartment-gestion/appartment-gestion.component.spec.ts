import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppartmentGestionComponent } from './appartment-gestion.component';

describe('AppartmentGestionComponent', () => {
  let component: AppartmentGestionComponent;
  let fixture: ComponentFixture<AppartmentGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppartmentGestionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppartmentGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
