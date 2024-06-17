import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Toaster } from 'ngx-toast-notifications';
import { ProveedorContactoEntity } from 'src/app/Models/ProveedorEntity';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-add-edit-contacto',
  templateUrl: './add-edit-contacto.component.html',
  styleUrls: ['./add-edit-contacto.component.scss']
})
export class AddEditContactoComponent implements OnInit {

  cTitle: string = "";
  bEdit: boolean = false;
  cUsuarioDNI: string = null;
  //form
  id: number = 0;
  proveedor_id: number = 0;
  cNombreCompleto: string = null;
  cCelular: string = null;
  email: string = null;
  myForm: FormGroup;
  nTipoDocumento: number = 1;
  cNroDocumento: string = null;
  nEstado: number = 1;

  itemContacto: ProveedorContactoEntity = null;

  lstEstados = [

    { nIdEstado: 1, cEstado: 'Activo' },
    { nIdEstado: 0, cEstado: 'Inactivo' },
  ];
  cboEstado: FormControl = new FormControl(1);
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddEditContactoComponent>,
    public toaster: Toaster,
    public fb: FormBuilder,

  ) {
    this.cTitle = this.data.cTitle;
    this.myForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    })
    this.bEdit = this.data.bEdit;

    if (this.bEdit) {
      this.itemContacto = this.data.contacto;



    }
  }

  ngOnInit(): void {

    if (this.bEdit) {
      this.cNombreCompleto = this.itemContacto.cNombreCompleto;
      this.cCelular = this.itemContacto.cCelular;
      this.f.email.setValue(this.itemContacto.cCorreo);
      this.nTipoDocumento = this.itemContacto.nTipoDocumento;
      this.cNroDocumento = this.itemContacto.cNroDocumento;
      this.cboEstado.setValue(this.itemContacto.nEstado);
    }
  }
  get f() { return this.myForm.controls; }

  public BotonAgregarContacto() {

    if (!this.cNombreCompleto || !this.cCelular || !this.cNroDocumento) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Complete los campos obligatorios.'` });
      return;
    }

    if (this.f.email.errors) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Inserte un correo válido.'` });
      return;
    }

    const contacto = new ProveedorContactoEntity();
    contacto.id = 0;
    contacto.cNombreCompleto = this.cNombreCompleto;
    contacto.cCelular = this.cCelular;
    contacto.cCorreo = this.f.email.value;
    contacto.nTipoDocumento = this.nTipoDocumento;
    contacto.cNroDocumento = this.cNroDocumento;
    contacto.nEstado = this.cboEstado.value;
    contacto.cUsuarioCreacion = this.cUsuarioDNI;
    contacto.cUsuarioModificacion = this.cUsuarioDNI;

    this.dialogRef.close(contacto);

  }

  public BotonActualizarContacto() {
    if (!this.cNombreCompleto || !this.cCelular || !this.cNroDocumento) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Complete los campos obligatorios.'` });
      return;
    }

    if (this.f.email.errors) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Inserte un correo válido.'` });
      return;
    }

    const contacto = new ProveedorContactoEntity();
    contacto.id = this.itemContacto.id;
    contacto.cNombreCompleto = this.cNombreCompleto;
    contacto.cCelular = this.cCelular;
    contacto.cCorreo = this.f.email.value;
    contacto.nTipoDocumento = this.nTipoDocumento;
    contacto.cNroDocumento = this.cNroDocumento;
    contacto.nEstado = this.cboEstado.value;
    contacto.cUsuarioCreacion = this.itemContacto.cUsuarioCreacion;
    contacto.cUsuarioModificacion = this.cUsuarioDNI;

    this.dialogRef.close(contacto);
  }

}
