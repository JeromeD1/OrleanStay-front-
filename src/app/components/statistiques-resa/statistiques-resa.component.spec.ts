import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatistiquesResaComponent } from './statistiques-resa.component';

describe('StatistiquesResaComponent', () => {
  let component: StatistiquesResaComponent;
  let fixture: ComponentFixture<StatistiquesResaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatistiquesResaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatistiquesResaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
