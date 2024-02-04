import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { ProveedorService } from '../_service/proveedor.service';
import { error } from 'console';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-edit-proveedor',
  templateUrl: './edit-proveedor.component.html',
  styleUrls: ['./edit-proveedor.component.scss']
})
export class EditProveedorComponent implements OnInit {


  isLoading$: any;

  constructor(
    public toaster: Toaster,
    public _proveedorService: ProveedorService,
    public modelService: NgbModal,
    public activerouter: ActivatedRoute,
  ) { }


  proveedor_id: any = 0;
  proveedor: any = null;
  contactos: any = [];

  listContactoNew: any = [];

  /* Data Proveedor */
  title: any = null;
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

    this.activerouter.params.subscribe((resp: any) => {
      this.proveedor_id = resp["id"] || "";
    })

    this.showProveedor(this.proveedor_id);


  }

  showProveedor(id: any) {
    this._proveedorService.showProveedor(id).subscribe((resp: any) => {
      console.log('proveedor: ', resp);

      this.proveedor = resp.proveedor;
      this.contactos = resp.contactos;
      this.title = this.proveedor.razon_social;

      this.tipoPersona = this.proveedor.tipoPersona;
      this.tipoDocumento = this.proveedor.tipoDocumento;
      this.nroDocumento = this.proveedor.nroDocumento;
      this.razonSocial = this.proveedor.razon_social;
      this.celular = this.proveedor.celular;
      this.correo = this.proveedor.correo;
      this.web = this.proveedor.web;
      this.direccion = this.proveedor.direccion;
      this.observaciones = this.proveedor.observaciones;

      this.listContacto = this.contactos;

    })
  }


  addContacto() {

    /* Validar campos llenos */
    if (!this.nombreContacto ||
      !this.correoContacto ||
      !this.tipoDocumentoContacto ||
      !this.celularContacto) {

      this.toaster.open(NoticyAlertComponent, { text: `warning-Todos los campos del contacto son obligatorios` });
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
    this.listContactoNew.push(dataContacto);

    /* Resetear campos */

    this.nombreContacto = null;
    this.correoContacto = null;
    this.nroDocumentoContacto = null;
    this.celularContacto = null;


  }

  removeContacto(contacto: any) {

    if (contacto.id !== 0) {
      const contactoInactivo = { ...contacto, estado: 0 };
      this.listContactoNew.push(contactoInactivo);
    } else {
      this.listContactoNew = this.listContactoNew.filter((item) => item != contacto);
    }

    const dataIndex = this.listContacto.findIndex(item => item === contacto);

    if (dataIndex !== -1) {
      this.listContacto.splice(dataIndex, 1);
    }


  }


  updateProveedor() {

    if (!this.razonSocial) {
      this.isButtonClicked = true;

      this.toaster.open(NoticyAlertComponent, { text: `warning-Ingrese el campo 'razon social' para continuar` });

      return;
    }

    if (!this.nroDocumento) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-Ingrese el campo 'Nro Documento' para continuar` });
    }

    if (!this.celular) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-Ingrese el campo 'Celular' para continuar` });
    }



    let dataProveedor = {
      id: this.proveedor_id,
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
      listContacto: this.listContactoNew

    }

    console.log('dataProveedor', dataProveedor);


    this.update(dataProveedor);
  }


  update(dataProveedor: any) {

    this._proveedorService.updateProveedor(dataProveedor).subscribe(
      (resp: any) => {
        console.log('Respuesta:', resp);

        if (resp.success) {
          /* this.resetForm(); */
          this.listContactoNew = [];
          this.showProveedor(this.proveedor_id);
          this.toaster.open(NoticyAlertComponent, { text: `success-El proveedor se actualizó exitosamente.` });
        }
      },
      (error: any) => {
        console.error('Error al actualizar el proveedor:', error);
        this.toaster.open(NoticyAlertComponent, { text: `danger-Ocurrió un error al actualizar el proveedor.` });
        return;
      }
    )


  }




}
