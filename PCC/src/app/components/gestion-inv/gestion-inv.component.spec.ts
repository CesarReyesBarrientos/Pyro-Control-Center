import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionInvComponent } from './gestion-inv.component';

describe('GestionInvComponent', () => {
  let component: GestionInvComponent;
  let fixture: ComponentFixture<GestionInvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionInvComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionInvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
