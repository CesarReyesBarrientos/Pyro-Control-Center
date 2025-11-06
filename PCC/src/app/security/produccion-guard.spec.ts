import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { produccionGuard } from './produccion-guard';

describe('produccionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => produccionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
