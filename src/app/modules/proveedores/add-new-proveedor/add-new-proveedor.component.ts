import { Component, OnInit } from '@angular/core';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-add-new-proveedor',
  templateUrl: './add-new-proveedor.component.html',
  styleUrls: ['./add-new-proveedor.component.scss']
})
export class AddNewProveedorComponent implements OnInit {

  constructor(
    public toaster: Toaster,
  ) { }

  listContacto: any = [];

  /* Data Contacto */
  nombreContacto: any = null;
  correoContacto: any = null;
  tipoDocumentoContacto: any = 1;
  nroDocumentoContacto: any = null;
  celularContacto: any = null;

  ngOnInit(): void {
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
}
