import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { almacenGuard } from './almacen-guard';

describe('almacenGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => almacenGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
