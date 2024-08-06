import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorRegistradorClientesComponent } from './buscador-registrador-clientes.component';

describe('BuscadorRegistradorClientesComponent', () => {
  let component: BuscadorRegistradorClientesComponent;
  let fixture: ComponentFixture<BuscadorRegistradorClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscadorRegistradorClientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscadorRegistradorClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
