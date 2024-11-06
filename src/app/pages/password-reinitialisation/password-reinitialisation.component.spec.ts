import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordReinitialisationComponent } from './password-reinitialisation.component';

describe('PasswordReinitialisationComponent', () => {
  let component: PasswordReinitialisationComponent;
  let fixture: ComponentFixture<PasswordReinitialisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordReinitialisationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordReinitialisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
