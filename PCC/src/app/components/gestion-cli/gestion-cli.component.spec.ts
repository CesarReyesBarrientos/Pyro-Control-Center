import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCliComponent } from './gestion-cli.component';

describe('GestionCliComponent', () => {
  let component: GestionCliComponent;
  let fixture: ComponentFixture<GestionCliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionCliComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionCliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
