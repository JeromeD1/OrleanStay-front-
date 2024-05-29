import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseVoyagersComponent } from './choose-voyagers.component';

describe('ChooseVoyagersComponent', () => {
  let component: ChooseVoyagersComponent;
  let fixture: ComponentFixture<ChooseVoyagersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseVoyagersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChooseVoyagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
