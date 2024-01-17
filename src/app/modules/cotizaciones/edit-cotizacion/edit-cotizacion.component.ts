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
  
  listproducto: any =[];
  listProductoNew: any = [];
  /* Data Cotizacion */
  cliente: any = null;
  vendedor: any = null;
  estado : any =null;
  fechaEmision: any = null;
  fechaExpiracion: any = null;
  total: any = null;
  observaciones: any = null;

  //Data productos
  producto_id: any = null;
  cantidad: any = null;
  descuento: any = null;
  descuentoHabilitado: boolean = false;
    
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
      this.listproducto = resp.productos;
      console.log('listproducto: ', this.listproducto);
      this.cliente = this.cotizacion.clienteName;
      this.observaciones = this.cotizacion.observaciones;
      this.vendedor = this.cotizacion.vendedorName;
      this.estado = this.cotizacion.estado;
      this.fechaEmision = this.cotizacion.fechaEmision;
      this.fechaExpiracion = this.cotizacion.fechaExpiracion;


      
    })
  }

  updateCotizacion() {
    let dataCotizacion = {
      id: this.cotizacion_id,
      estado: this.estado,
      cliente: this.cliente,
      vendedor: this.vendedor,
      fechaEmision: this.fechaEmision,
      fechaExpiracion: this.fechaExpiracion,
      total: 100,
      observaciones: this.observaciones,
      estadoCotizacion : this.estado,
      listProducto :this.listProductoNew

    }
    console.log('dataCotizacion', dataCotizacion);
    //this.update(dataCotizacion);
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
    this.listproducto.push(dataProducto),
    this.listProductoNew.push(dataProducto)
    console.log('listProducto:', this.listproducto);

  }


  removeproducto(producto:any){
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
  }

}
