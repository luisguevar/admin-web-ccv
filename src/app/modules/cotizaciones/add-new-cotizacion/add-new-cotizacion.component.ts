import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { CotizacionService } from '../_service/cotizacion.service';
import { error } from 'console';
@Component({
  selector: 'app-add-new-cotizacion',
  templateUrl: './add-new-cotizacion.component.html',
  styleUrls: ['./add-new-cotizacion.component.scss']
})
export class AddNewCotizacionComponent implements OnInit {
  isLoading$: any;

  constructor(
    public toaster: Toaster,
    public _CotizacionService: CotizacionService,
    public modelService: NgbModal,
  ) { }

  /* Data Proveedor */
  //tipoPersona: any = 1;
  //Precio: any = 1;
  //nroDocumento: any = null;
  cliente_id: any = null;
  vendedor_id: any = null;
  estadoCotizacion : any =null;
  fechaEmision: any = null;
  fechaExpiracion: any = null;
  total: any = null;
  observaciones: any = null;
  
  
  listProducto: any = [];


  /* Data Producto */
  nombreProducto: any = null;
  Cantidad: any = null;
  Precio: any = null;
  
  
  isButtonClicked: boolean = false;

  ngOnInit(): void {
    this.isLoading$ = this._CotizacionService.isLoadingSubject;
  }

  // addProducto() {

  //   /* Validar campos llenos */
  //   if (!this.nombreProducto || !this.Cantidad || !this.Precio) {

  //     this.toaster.open(NoticyAlertComponent, { text: `danger-'Todos los campos del Producto son obligatorios'` });
  //     return;
  //   }


  //   /* Insertar campos a la lista */
  //   let dataProducto = {
  //     id: 0,
  //     estado: 1,
  //     nombre: this.nombreProducto,
  //     cantidad: this.Cantidad,
  //     precio: this.Precio,
  //   }

  //   this.listProducto.push(dataProducto);

  //   /* Resetear campos */

  //   this.nombreProducto = null;
  //   this.Cantidad = null;
  //   this.Precio = null

  // }

  // removeProducto(Producto: any) {

  //   if (Producto.id == 0) {
  //     this.listProducto = this.listProducto.filter((item) => item != Producto);
  //   }


  // }

  createCotizacion() {
    if (!this.observaciones) {
      this.toaster.open(NoticyAlertComponent, { text: `danger-'El campo observaciones es requerido.'` });
      return;
    }

    let dataCotizacion = {
      id: 0,
      estado: 1,
      cliente_id : 1,
      vendedor_id : 1,
      fechaEmision: this.fechaEmision,
      fechaExpiracion: this.fechaExpiracion,
      total: 100,
      observaciones: this.observaciones,
      estadoCotizacion : this.estadoCotizacion
      //listProducto: this.listProducto

    }

    console.log('dataCotizacion', dataCotizacion);

    this.save(dataCotizacion);
  }


  save(dataCotizacion: any) {

    this._CotizacionService.createCotizacion(dataCotizacion).subscribe(
      (resp: any) => {
        console.log('Respuesta:', resp);

        if (resp.success) {
          this.resetForm();
          this.toaster.open(NoticyAlertComponent, { text: `primary-'Cotizacion guardado correctamente'` });
        }
      },
      (error: any) => {
        console.error('Error al guardar la Cotizacion:', error);
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al guardar la Cotizacion.'` });
        return;
      }
    )
  }

   resetForm() {
     this.fechaEmision = null;
     this.fechaExpiracion= null;
     this.observaciones = null;
    //  this.razonSocial = null;
    //  this.celular = null;
    //  this.cantidad = null;
    //  this.fechaExpiracion = null;
    //  this.total = null;
    //  this.observaciones = null;
    //  this.listProducto = null;
    //  this.nombreProducto = null;
    //  this.Cantidad = null;
    //  this.Estado = null;   
    //  this.isButtonClicked = false;

   }
}
