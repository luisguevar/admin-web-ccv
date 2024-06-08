import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiciosGeneralService } from '../../servicios-general.service';
import { Toaster } from 'ngx-toast-notifications';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-add-edit-cliente',
  templateUrl: './add-edit-cliente.component.html',
  styleUrls: ['./add-edit-cliente.component.scss']
})
export class AddEditClienteComponent implements OnInit {
  isLoading$;
  isLoading: boolean = false;
  cTitle: string = '';
  bEdit: boolean = false;
  usuario_dni: string = '';

  cliente: any;

  //form
  myForm: FormGroup;
  cliente_id: number = 0;
  name: string = null;
  surname: string = null;
  phone: string = null;
  personType: number = 1;
  documentType: number = 1;
  documentNumber: string = null;
  cboPais: FormControl = new FormControl(89);
  cboCiudad: FormControl = new FormControl(0);
  address: string = '';
  cboEstado: FormControl = new FormControl(1);

  lstEstados = [
    { nIdEstado: 1, cEstado: 'Activo' },
    { nIdEstado: 0, cEstado: 'Inactivo' },
  ];
  paises: any;
  ciudades: any;




  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddEditClienteComponent>,
    public _service: ServiciosGeneralService,
    public toaster: Toaster,
    public fb: FormBuilder,
    public authservice: AuthService
  ) {
    this.usuario_dni = this.authservice.user.cDocumento;
    this.bEdit = this.data.bEdit;
    this.cliente = this.data.cliente;
    this.cTitle = this.data.cTitle;
    this.myForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
    this.GetPaises();
  }
  get f() { return this.myForm.controls; }

  ngOnInit(): void {

    if (!this.bEdit) {
      this.GetCiudades(89);
    } else {

      this.SetearValores(this.cliente);
    }
    this.cboPais.valueChanges.subscribe((value) => {
      this.GetCiudades(value);
    })
  }

  SetearValores(cliente) {
    this.cliente_id = cliente.id;
    this.name = cliente.cNombres;
    this.surname = cliente.cApellidos;
    this.f.email.setValue(cliente.cCorreo);
    this.phone = cliente.cCelular;
    this.personType = cliente.nTipoPersona;
    this.documentType = cliente.nTipoDocumento;
    this.documentNumber = cliente.cNroDocumento;
    this.cboPais.setValue(cliente.pais_id);
    this.cboCiudad.setValue(cliente.ciudad_id);
    this.address = cliente.cDireccion;
    this.cboEstado.setValue(cliente.nEstado);


    this.GetCiudades(cliente.pais_id);

  }

  BotonGuardarCliente() {
    if (!this.name || !this.surname || !this.f.email.value || !this.phone || !this.documentNumber) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Complete todos los campos para continuar.'` });
      return;
    }

    const data = {

      'cNombres': this.name,
      'cApellidos': this.surname,
      'cCorreo': this.f.email.value,
      'nTipoPersona': this.personType,
      'nTipoDocumento': this.documentType,
      'cNroDocumento': this.documentNumber,
      'cCelular': this.phone,
      'cDireccion': this.address,
      'pais_id': this.cboPais.value,
      'ciudad_id': this.cboCiudad.value,
      'nEstado': this.cboEstado.value,
      'cUsuarioCreacion': this.usuario_dni,
      'cUsuarioModificacion': this.usuario_dni,

    }

    /* console.log('data: ', data); */
    this._service.PostClientes(data).subscribe((resp: any) => {
      /* console.log('CREATE: ', resp); */

      if (resp.success) {

        this.toaster.open(NoticyAlertComponent, { text: `primary-'Cliente guardado correctamente'` });
        this.cliente_id = resp.cliente.id;
        this.bEdit = true;
        this.cTitle = 'Editar Cliente';
      } else {
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al guardar el Cliente.'` });
      }


    },
      (error: any) => {

        /* console.log(error); */
        if (error.status === 400 && error.error.message) {
          let messages = '';

          this.toaster.open(NoticyAlertComponent, { text: `danger-'${error.error.message}'` });
        } else {
          this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al guardar el Cliente.'` });
        }
      }


    )
  }

  BotonActualizarCliente() {
    if (!this.name || !this.surname || !this.f.email.value || !this.phone || !this.documentNumber) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Complete todos los campos para continuar.'` });
      return;
    }

    const data = {

      'cNombres': this.name,
      'cApellidos': this.surname,
      'cCorreo': this.f.email.value,
      'nTipoPersona': this.personType,
      'nTipoDocumento': this.documentType,
      'cNroDocumento': this.documentNumber,
      'cCelular': this.phone,
      'cDireccion': this.address,
      'pais_id': this.cboPais.value,
      'ciudad_id': this.cboCiudad.value,
      'nEstado': this.cboEstado.value,
      'cUsuarioModificacion': this.usuario_dni,

    }

    /* console.log('data: ', data); */
    this._service.PutClientes(this.cliente_id, data).subscribe((resp: any) => {


      if (resp.success) {

        this.toaster.open(NoticyAlertComponent, { text: `success-'Cliente actualizado correctamente'` });

      } else {
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar el Cliente.'` });
      }
    },
      (error: any) => {
        /* console.log(error); */
        if (error.status === 400 && error.error.message) {


          this.toaster.open(NoticyAlertComponent, { text: `danger-'${error.error.message}'` });
        } else {
          this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar el Cliente.'` });
        }
      }


    )
  }
  GetPaises() {
    this._service.GetPaises().subscribe((resp: any) => {
      /* console.log(resp); */
      this.paises = resp.paises;

    });
  }

  GetCiudades(pais_id: number) {
    this._service.GetCiudades(pais_id).subscribe((resp: any) => {
      /* console.log(resp); */
      this.ciudades = resp.ciudades;
    });
  }


}
