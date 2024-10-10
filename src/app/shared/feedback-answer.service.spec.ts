import { TestBed } from '@angular/core/testing';

import { FeedbackAnswerService } from './feedback-answer.service';

describe('FeedbackAnswerService', () => {
  let service: FeedbackAnswerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedbackAnswerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
