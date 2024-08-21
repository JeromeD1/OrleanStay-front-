import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelInfoEditionComponent } from './travel-info-edition.component';

describe('TravelInfoEditionComponent', () => {
  let component: TravelInfoEditionComponent;
  let fixture: ComponentFixture<TravelInfoEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelInfoEditionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TravelInfoEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
