import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAppartmentPhotosComponent } from './update-appartment-photos.component';

describe('UpdateAppartmentPhotosComponent', () => {
  let component: UpdateAppartmentPhotosComponent;
  let fixture: ComponentFixture<UpdateAppartmentPhotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAppartmentPhotosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateAppartmentPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
