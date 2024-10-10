import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelInfoPopupComponent } from './travel-info-popup.component';

describe('TravelInfoPopupComponent', () => {
  let component: TravelInfoPopupComponent;
  let fixture: ComponentFixture<TravelInfoPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelInfoPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TravelInfoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
