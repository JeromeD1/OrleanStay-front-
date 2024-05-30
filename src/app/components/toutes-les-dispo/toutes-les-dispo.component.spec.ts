import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToutesLesDispoComponent } from './toutes-les-dispo.component';

describe('ToutesLesDispoComponent', () => {
  let component: ToutesLesDispoComponent;
  let fixture: ComponentFixture<ToutesLesDispoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToutesLesDispoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToutesLesDispoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
