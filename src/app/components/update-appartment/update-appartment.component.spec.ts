import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAppartmentComponent } from './update-appartment.component';

describe('UpdateAppartmentComponent', () => {
  let component: UpdateAppartmentComponent;
  let fixture: ComponentFixture<UpdateAppartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAppartmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateAppartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
