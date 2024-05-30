import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlusDeDetailsComponent } from './plus-de-details.component';

describe('PlusDeDetailsComponent', () => {
  let component: PlusDeDetailsComponent;
  let fixture: ComponentFixture<PlusDeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlusDeDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlusDeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
