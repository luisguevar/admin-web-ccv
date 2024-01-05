import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { ProveedorService } from '../_service/proveedor.service';

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
  }
}
