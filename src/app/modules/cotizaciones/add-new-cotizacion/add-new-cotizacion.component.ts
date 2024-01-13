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
  estadoCotizacion: any = null;
  fechaEmision: any = null;
  fechaExpiracion: any = null;
  total: any = null;
  observaciones: any = null;



  //Data productos
  producto_id: any = null;
  cantidad: any = null;
  descuento: any = null;
  listProducto: any = [];


  /* Data Producto */
  nombreProducto: any = null;
  Cantidad: any = null;
  Precio: any = null;


  isButtonClicked: boolean = false;
  descuentoHabilitado: boolean = false;

  ngOnInit(): void {
    this.isLoading$ = this._CotizacionService.isLoadingSubject;
  }

  addProducto() {
    let dataProducto = {
      id : 0,
      estado : 1,
      producto_id : 1,
      nombre: "sin nombre",
      precio : 100,
      cantidad : this.cantidad,
      descuentoHabilitado: this.descuentoHabilitado,
      descuento : this.descuento,

      total : (this.cantidad * 100 *(100 - this.descuento))/100,

    }

    this.listProducto.push(dataProducto)
    console.log('listProducto:', this.listProducto);

  }

  createCotizacion() {
    if (!this.observaciones) {
      this.toaster.open(NoticyAlertComponent, { text: `danger-'El campo observaciones es requerido.'` });
      return;
    }

    let dataCotizacion = {
      id: 0,
      estado: 1,
      cliente_id: 1,
      vendedor_id: 1,
      fechaEmision: this.fechaEmision,
      fechaExpiracion: this.fechaExpiracion,
      total: 100,
      observaciones: this.observaciones,
      estadoCotizacion: this.estadoCotizacion
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
    this.fechaExpiracion = null;
    this.observaciones = null;

  }

  onCheckboxChange() {
    if (!this.descuentoHabilitado) {
      this.descuento = null;
    }
    else{
      this.descuento = 1;
    }
  }

  removeProducto(producto: any) {

    if (producto.id == 0) {
      this.listProducto = this.listProducto.filter((item) => item != producto);
    }


  }

}
