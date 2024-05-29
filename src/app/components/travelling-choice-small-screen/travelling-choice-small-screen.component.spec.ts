import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravellingChoiceSmallScreenComponent } from './travelling-choice-small-screen.component';

describe('TravellingChoiceSmallScreenComponent', () => {
  let component: TravellingChoiceSmallScreenComponent;
  let fixture: ComponentFixture<TravellingChoiceSmallScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravellingChoiceSmallScreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TravellingChoiceSmallScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
