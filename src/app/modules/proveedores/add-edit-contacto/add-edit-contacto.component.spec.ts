import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditContactoComponent } from './add-edit-contacto.component';

describe('AddEditContactoComponent', () => {
  let component: AddEditContactoComponent;
  let fixture: ComponentFixture<AddEditContactoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditContactoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditContactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
