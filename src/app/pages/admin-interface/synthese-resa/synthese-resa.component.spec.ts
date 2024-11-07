import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyntheseResaComponent } from './synthese-resa.component';

describe('SyntheseResaComponent', () => {
  let component: SyntheseResaComponent;
  let fixture: ComponentFixture<SyntheseResaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyntheseResaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SyntheseResaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
