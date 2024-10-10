import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReservationChatComponent } from './admin-reservation-chat.component';

describe('AdminReservationChatComponent', () => {
  let component: AdminReservationChatComponent;
  let fixture: ComponentFixture<AdminReservationChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReservationChatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminReservationChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
