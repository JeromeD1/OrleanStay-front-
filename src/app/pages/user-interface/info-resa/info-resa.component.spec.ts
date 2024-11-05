import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoResaComponent } from './info-resa.component';

describe('InfoResaComponent', () => {
  let component: InfoResaComponent;
  let fixture: ComponentFixture<InfoResaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoResaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoResaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
