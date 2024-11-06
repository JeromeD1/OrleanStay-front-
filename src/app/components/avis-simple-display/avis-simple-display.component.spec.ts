import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisSimpleDisplayComponent } from './avis-simple-display.component';

describe('AvisSimpleDisplayComponent', () => {
  let component: AvisSimpleDisplayComponent;
  let fixture: ComponentFixture<AvisSimpleDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvisSimpleDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvisSimpleDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
