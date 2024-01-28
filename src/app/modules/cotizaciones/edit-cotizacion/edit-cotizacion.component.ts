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
  cliente_id: any = 0;
  vendedor_id: any = 0;

  listproducto: any = [];
  listProductoNew: any = [];
  /* Data Cotizacion */
  cliente: any = null;
  vendedor: any = null;
  estado: any = null;
  fechaEmision: any = null;
  fechaExpiracion: any = null;
  total: any = null;
  observaciones: any = null;
  estadoCotizacion: number = 1;
  //Data productos
  producto_id: any = null;
  cantidad: any = null;
  descuento: any = null;
  descuentoHabilitado: boolean = false;
  totalproducto: any = null;

  /* Data Contacto */
  nombreContacto: any = null;
  correoContacto: any = null;
  tipoDocumentoContacto: any = 1;
  nroDocumentoContacto: any = null;
  celularContacto: any = null;

  isButtonClicked: boolean = false;

  //resumen
  netoCotizacion: any = 0
  totalCotizacion: any = 0;
  igvCotizacion: any = 0;
  subtotalCotizacion: any = 0;
  descuentoGlobalHabilitado: boolean = false;
  descuentoGlobal: any = null;
  totalTemporal: any = 0;


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
      this.listproducto = resp.productos;

      console.log('listproducto: ', this.listproducto);
      this.cliente = this.cotizacion.clienteName  + '(' + this.cotizacion.clienteNroDocumento + ')';
      this.observaciones = this.cotizacion.observaciones;
      this.vendedor = this.cotizacion.vendedorName;
      this.estadoCotizacion = this.cotizacion.estadoCotizacion;
      this.fechaEmision = this.cotizacion.fechaEmision;
      this.fechaExpiracion = this.cotizacion.fechaExpiracion;
      /* this.total = this.cotizacion.total */
      this.totalTemporal = this.cotizacion.total;
      //this.totalproducto = this.listproducto.cantidad * this.listproducto.precio;
      console.log(this.totalproducto);
      this.cliente_id = this.cotizacion.cliente_id;
      this.vendedor_id = this.cotizacion.vendedor_id;

      this.totalTemporal = this.cotizacion.total;
      this.calcularSubTotal();

      if (this.cotizacion.tieneDescuento) {
        this.descuentoGlobalHabilitado = true;
        this.descuentoGlobal = this.cotizacion.descuento;

        this.totalCotizacion = this.cotizacion.total * ((100 - this.cotizacion.descuento) / 100);
      }

    })
  }

  updateCotizacion() {
    let dataCotizacion = {
      id: this.cotizacion_id,
      estado: 1,
      cliente_id: this.cliente_id,
      vendedor_id: this.vendedor_id,
      fechaEmision: this.fechaEmision,
      fechaExpiracion: this.fechaExpiracion,
      total: this.totalTemporal,
      observaciones: this.observaciones,
      estadoCotizacion: this.estadoCotizacion,
      tieneDescuento: this.descuentoGlobalHabilitado,
      descuento: 0,
      listProducto: this.listProductoNew

    }
    if (this.descuentoGlobalHabilitado) {
      dataCotizacion.descuento = this.descuentoGlobal;
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
          this.listProductoNew = [];
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

  addProducto() {
    let dataProducto = {
      id: 0,
      estado: 1,
      producto_id: 1,
      nombre: "sin nombre",
      precio: 100,
      cantidad: this.cantidad,
      descuentoHabilitado: this.descuentoHabilitado,
      descuento: this.descuento,
      total: (this.cantidad * 100 * (100 - this.descuento)) / 100,
    }
    this.totalTemporal = this.totalTemporal + dataProducto.total;
    console.log(this.totalTemporal);
    this.calcularSubTotal();

    this.listproducto.push(dataProducto);
    this.listProductoNew.push(dataProducto)
    console.log('listProducto:', this.listproducto);

  }
  onCheckboxChange() {
    if (!this.descuentoHabilitado) {
      this.descuento = null;
    }
    else {
      this.descuento = 1;

    }
  }


  onCheckboxChangeDescuentoGlobal() {
    if (!this.descuentoGlobalHabilitado) {
      this.descuentoGlobal = null;
      this.totalCotizacion = this.totalTemporal;
    }
    else {
      this.descuentoGlobal = 0;
      this.totalCotizacion = this.totalTemporal * (100 - this.descuentoGlobal) / 100;
    }
  }

  calcularDescuento() {
    this.totalCotizacion = this.totalTemporal * (100 - this.descuentoGlobal) / 100;
  }


  removeproducto(producto: any) {
    console.log(producto)
    if (producto.id !== 0) {
      const productoInactivo = { ...producto, estado: 0 };
      this.listProductoNew.push(productoInactivo);
    } else {
      this.listProductoNew = this.listProductoNew.filter((item) => item != producto);
    }

    const dataIndex = this.listproducto.findIndex(item => item === producto);

    if (dataIndex !== -1) {
      this.listproducto.splice(dataIndex, 1);
    }

    this.totalTemporal = this.totalTemporal - (producto.precio * producto.cantidad);
    this.calcularSubTotal();
  }

  calcularSubTotal() {
    this.descuentoGlobalHabilitado = false;
    this.descuentoGlobal = null;

    const total = this.totalTemporal;
    this.igvCotizacion = (total * 0.18).toFixed(2); // Utilizando toFixed para limitar a 2 decimales

    this.netoCotizacion = total - this.igvCotizacion;
    this.subtotalCotizacion = total;
    this.totalCotizacion = total;

  }

}
