import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { ProveedorService } from '../_service/proveedor.service';
import { error } from 'console';

@Component({
  selector: 'app-add-new-proveedor',
  templateUrl: './add-new-proveedor.component.html',
  styleUrls: ['./add-new-proveedor.component.scss']
})
export class AddNewProveedorComponent implements OnInit {

  isLoading$: any;

  constructor(
    public toaster: Toaster,
    public _proveedorService: ProveedorService,
    public modelService: NgbModal,
  ) { }



  /* Data Proveedor */
  tipoPersona: any = 1;
  tipoDocumento: any = 1;
  nroDocumento: any = null;
  razonSocial: any = null;
  celular: any = null;
  correo: any = null;
  web: any = null;
  direccion: any = null;
  observaciones: any = null;
  listContacto: any = [];


  /* Data Contacto */
  nombreContacto: any = null;
  correoContacto: any = null;
  tipoDocumentoContacto: any = 1;
  nroDocumentoContacto: any = null;
  celularContacto: any = null;

  isButtonClicked: boolean = false;

  ngOnInit(): void {
    this.isLoading$ = this._proveedorService.isLoadingSubject;
  }

  addContacto() {

    /* Validar campos llenos */
    if (!this.nombreContacto ||
      !this.correoContacto ||
      !this.tipoDocumentoContacto ||
      !this.celularContacto) {

      this.toaster.open(NoticyAlertComponent, { text: `danger-'Todos los campos del contacto son obligatorios'` });
      return;
    }


    /* Insertar campos a la lista */
    let dataContacto = {
      id: 0,
      estado: 1,
      nombre: this.nombreContacto,
      correo: this.correoContacto,
      tipoDocumento: this.tipoDocumentoContacto,
      nroDocumento: this.nroDocumentoContacto,
      celular: this.celularContacto,

    }

    this.listContacto.push(dataContacto);

    /* Resetear campos */

    this.nombreContacto = null;
    this.correoContacto = null;
    this.nroDocumentoContacto = null;
    this.celularContacto = null;


  }

  removeContacto(contacto: any) {

    if (contacto.id == 0) {
      this.listContacto = this.listContacto.filter((item) => item != contacto);
    }


  }


  createProveedor() {

    if (!this.razonSocial) {
      this.isButtonClicked = true;
      return;
    }

    let dataProveedor = {
      id: 0,
      estado: 1,
      tipoPersona: this.tipoPersona,
      tipoDocumento: this.tipoDocumento,
      nroDocumento: this.nroDocumento,
      razon_social: this.razonSocial,
      celular: this.celular,
      correo: this.correo,
      web: this.web,
      direccion: this.direccion,
      observaciones: this.observaciones,
      listContacto: this.listContacto

    }

    console.log('dataProveedor', dataProveedor);

    this.save(dataProveedor);
  }


  save(dataProveedor: any) {

    this._proveedorService.createProveedor(dataProveedor).subscribe(
      (resp: any) => {
        console.log('Respuesta:', resp);

        if (resp.success) {
          this.resetForm();
          this.toaster.open(NoticyAlertComponent, { text: `primary-'Proveedor guardado correctamente'` });
        }
      },
      (error: any) => {
        console.error('Error al guardar el proveedor:', error);
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al guardar el proveedor.'` });
        return;
      }
    )
  }

  resetForm() {
    this.tipoPersona = null;
    this.tipoDocumento = null;
    this.nroDocumento = null;
    this.razonSocial = null;
    this.celular = null;
    this.correo = null;
    this.web = null;
    this.direccion = null;
    this.observaciones = null;
    this.listContacto = null;
    this.nombreContacto = null;
    this.correoContacto = null;
    this.nroDocumentoContacto = null;
    this.celularContacto = null;
    this.isButtonClicked = false;

  }


}
