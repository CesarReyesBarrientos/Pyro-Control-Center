import { TestBed } from '@angular/core/testing';
import { RoleService } from './role';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';

const authServiceStub = {
  user$: of(null), 
};

describe('RoleService', () => {
  let service: RoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RoleService, 
      
        { provide: AuthService, useValue: authServiceStub }
      ]
    });
    service = TestBed.inject(RoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});