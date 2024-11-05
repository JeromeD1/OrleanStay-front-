import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { infoResaResolver } from './info-resa.resolver';

describe('infoResaResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => infoResaResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
