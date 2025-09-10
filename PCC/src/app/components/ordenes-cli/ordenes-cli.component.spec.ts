import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesCliComponent } from './ordenes-cli.component';

describe('OrdenesCliComponent', () => {
  let component: OrdenesCliComponent;
  let fixture: ComponentFixture<OrdenesCliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenesCliComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrdenesCliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
