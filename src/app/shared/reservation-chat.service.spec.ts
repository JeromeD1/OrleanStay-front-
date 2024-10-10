import { TestBed } from '@angular/core/testing';

import { ReservationChatService } from './reservation-chat.service';

describe('ReservationChatService', () => {
  let service: ReservationChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservationChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
