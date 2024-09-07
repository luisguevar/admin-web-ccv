import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmadorEliminadorObservacionComponent } from './confirmador-eliminador-observacion.component';

describe('ConfirmadorEliminadorObservacionComponent', () => {
  let component: ConfirmadorEliminadorObservacionComponent;
  let fixture: ComponentFixture<ConfirmadorEliminadorObservacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmadorEliminadorObservacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmadorEliminadorObservacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
