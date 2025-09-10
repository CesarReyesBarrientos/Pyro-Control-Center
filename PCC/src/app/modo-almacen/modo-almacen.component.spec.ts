import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModoAlmacenComponent } from './modo-almacen.component';

describe('ModoAlmacenComponent', () => {
  let component: ModoAlmacenComponent;
  let fixture: ComponentFixture<ModoAlmacenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModoAlmacenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModoAlmacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
