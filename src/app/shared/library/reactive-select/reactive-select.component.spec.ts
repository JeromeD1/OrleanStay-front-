import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveSelectComponent } from './reactive-select.component';

describe('ReactiveSelectComponent', () => {
  let component: ReactiveSelectComponent;
  let fixture: ComponentFixture<ReactiveSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReactiveSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
