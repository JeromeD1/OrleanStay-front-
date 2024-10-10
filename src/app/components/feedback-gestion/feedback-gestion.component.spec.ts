import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackGestionComponent } from './feedback-gestion.component';

describe('FeedbackGestionComponent', () => {
  let component: FeedbackGestionComponent;
  let fixture: ComponentFixture<FeedbackGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackGestionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeedbackGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
