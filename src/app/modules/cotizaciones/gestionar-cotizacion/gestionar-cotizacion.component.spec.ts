import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarCotizacionComponent } from './gestionar-cotizacion.component';

describe('GestionarCotizacionComponent', () => {
  let component: GestionarCotizacionComponent;
  let fixture: ComponentFixture<GestionarCotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionarCotizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarCotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
