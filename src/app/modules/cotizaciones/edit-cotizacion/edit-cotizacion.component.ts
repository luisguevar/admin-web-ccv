import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { CotizacionService } from '../_service/cotizacion.service';
import { error } from 'console';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-edit-cotizacion',
  templateUrl: './edit-cotizacion.component.html',
  styleUrls: ['./edit-cotizacion.component.scss']
})
export class EditCotizacionComponent implements OnInit {

  isLoading$: any;

  constructor(
    public toaster: Toaster,
    public _cotizacionService: CotizacionService,
    public modelService: NgbModal,
    public activerouter: ActivatedRoute,
  ) { }


  cotizacion_id: any = 0;
  cotizacion: any = null;
  productos: any = [];

  listproductoNew: any = [];

  /* Data Cotizacion */
  cliente_id: any = null;
  vendedor_id: any = null;
  estadoCotizacion : any =null;
  fechaEmision: any = null;
  fechaExpiracion: any = null;
  total: any = null;
  observaciones: any = null;


  /* Data Contacto */
  nombreContacto: any = null;
  correoContacto: any = null;
  tipoDocumentoContacto: any = 1;
  nroDocumentoContacto: any = null;
  celularContacto: any = null;

  isButtonClicked: boolean = false;

  ngOnInit(): void {
    this.isLoading$ = this._cotizacionService.isLoadingSubject;

    this.activerouter.params.subscribe((resp: any) => {
      this.cotizacion_id = resp["id"] || "";
    })

    this.showCotizacion(this.cotizacion_id);


  }

  showCotizacion(id: any) {
    this._cotizacionService.showCotizacion(id).subscribe((resp: any) => {
      console.log('cotizacion: ', resp);

      this.cotizacion = resp.cotizacion;
      // this.productos = resp.productos;

      this.observaciones = this.cotizacion.observaciones;
      // this.tipoPersona = this.cotizacion.tipoPersona;
      // this.tipoDocumento = this.cotizacion.tipoDocumento;
      // this.nroDocumento = this.cotizacion.nroDocumento;
      // this.razonSocial = this.cotizacion.razon_social;
      // this.celular = this.cotizacion.celular;
      // this.correo = this.cotizacion.correo;
      // this.web = this.cotizacion.web;
      // this.direccion = this.cotizacion.direccion;
      // this.observaciones = this.cotizacion.observaciones;
      // this.listProducto = this.productos;

    })
  }


  


  updateCotizacion() {
    
    let dataCotizacion = {
      id: this.cotizacion_id,
      estado: 1,
      cliente_id : 1,
      vendedor_id : 1,
      fechaEmision: this.fechaEmision,
      fechaExpiracion: this.fechaExpiracion,
      total: 100,
      observaciones: this.observaciones,
      estadoCotizacion : this.estadoCotizacion

    }

    console.log('dataCotizacion', dataCotizacion);


    this.update(dataCotizacion);
  }


  update(dataCotizacion: any) {

    this._cotizacionService.updateCotizacion(dataCotizacion).subscribe(
      (resp: any) => {
        console.log('Respuesta:', resp);

        if (resp.success) {
          /* this.resetForm(); */
          this.listproductoNew = [];
          this.showCotizacion(this.cotizacion_id);
          this.toaster.open(NoticyAlertComponent, { text: `primary-'Cotizacion actualizado correctamente'` });
        }
      },
      (error: any) => {
        console.error('Error al actualizar el proveedor:', error);
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar la Cotizacion.'` });
        return;
      }
    )


  }

}
