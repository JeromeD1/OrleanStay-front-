import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelInfoOverviewComponent } from './travel-info-overview.component';

describe('TravelInfoOverviewComponent', () => {
  let component: TravelInfoOverviewComponent;
  let fixture: ComponentFixture<TravelInfoOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelInfoOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TravelInfoOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
