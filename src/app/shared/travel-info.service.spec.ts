import { TestBed } from '@angular/core/testing';

import { TravelInfoService } from './travel-info.service';

describe('TravelInfoService', () => {
  let service: TravelInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TravelInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
