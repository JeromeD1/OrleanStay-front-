import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravellingChoicesComponent } from './travelling-choices.component';

describe('TravellingChoicesComponent', () => {
  let component: TravellingChoicesComponent;
  let fixture: ComponentFixture<TravellingChoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravellingChoicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TravellingChoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
