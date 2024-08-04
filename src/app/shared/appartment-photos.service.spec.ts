import { TestBed } from '@angular/core/testing';

import { AppartmentPhotosService } from './appartment-photos.service';

describe('AppartmentPhotosService', () => {
  let service: AppartmentPhotosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppartmentPhotosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
