import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { CotizacionService } from '../_service/cotizacion.service';
import { error } from 'console';
import { AddClienteComponent } from '../../clientes/add-cliente/add-cliente.component';
import { AddDialogClienteComponent } from '../add-dialog-cliente/add-dialog-cliente.component';
import { AuthService } from '../../auth';
@Component({
  selector: 'app-add-new-cotizacion',
  templateUrl: './add-new-cotizacion.component.html',
  styleUrls: ['./add-new-cotizacion.component.scss']
})
export class AddNewCotizacionComponent implements OnInit {


  isLoading$;
  isLoading = false;
  listClientes: any = [];

  constructor(
    public toaster: Toaster,
    public _CotizacionService: CotizacionService,
    public modelService: NgbModal,
    private cdr: ChangeDetectorRef,
    public authservice: AuthService,
  ) { }

  /* Data Proveedor */
  //tipoPersona: any = 1;
  //Precio: any = 1;
  //nroDocumento: any = null;
  cliente_id: any = 0;
  vendedor_id: any = null;
  estadoCotizacion: any = 1;
  fechaEmision: any = null;
  fechaExpiracion: any = null;
  total: any = null;
  observaciones: any = null;
  cliente_nombre: any = null;
  vendedor_nombre: any = null;

//resumen
  totalCotizacion:any = 0;
  igvCotizacion:any = 0;
  subtotalCotizacion:any  =0;

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

  usuario: any = null;
  listProductosall:any = null;


  ngOnInit(): void {
    this.isLoading$ = this._CotizacionService.isLoadingSubject;
    this.allClientes();
    this.vendedor_nombre = this.authservice.user.name + ' ' + this.authservice.user.surname + ' / ' + this.authservice.user.email;
    this.vendedor_id = this.authservice.user.id;
    console.log('user: ', this.authservice.user)
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

    this.totalCotizacion = this.totalCotizacion + dataProducto.total;
    this.igvCotizacion = this.totalCotizacion*0.18;
    this.subtotalCotizacion = this.totalCotizacion - this.igvCotizacion
    this.listProducto.push(dataProducto);
    console.log('listProducto:', this.listProducto);
    

  }

  createCotizacion() {

    if (!this.cliente_nombre) {
      this.toaster.open(NoticyAlertComponent, { text: `danger-'Ingrese un cliente para continuar.'` });
      return;
    }

    if (!this.observaciones) {
      this.toaster.open(NoticyAlertComponent, { text: `danger-'El campo observaciones es requerido.'` });
      return;
    }

    let dataCotizacion = {
      id: 0,
      estado: 1,
      cliente_id: this.vendedor_id,
      vendedor_id: this.vendedor_id,
      fechaEmision: this.fechaEmision,
      fechaExpiracion: this.fechaExpiracion,
      total: this.totalCotizacion,
      observaciones: this.observaciones,
      estadoCotizacion: this.estadoCotizacion,
      listProducto: this.listProducto

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
    else {
      this.descuento = 1;
    }
  }

  removeProducto(producto: any) {

    if (producto.id == 0) {
      this.listProducto = this.listProducto.filter((item) => item != producto);
      this.totalCotizacion = this.totalCotizacion - producto.total
      this.igvCotizacion = this.totalCotizacion*0.18;
      this.subtotalCotizacion = this.totalCotizacion - this.igvCotizacion
    }



  }

  allClientes() {
    this._CotizacionService.allClientes().subscribe((resp: any) => {
      console.log('Clientes: ', resp);
      this.listClientes = resp.clientes;
    })
  }

  allProductos() {
    this._CotizacionService.allProductos().subscribe((resp: any) => {
      console.log('Productos: ', resp);
      this.listProductosall = resp.Productos;
    })
  }

  addCliente() {
    const modalRef = this.modelService.open(AddDialogClienteComponent, { centered: true, size: 'lg' });
    // Capturar el resultado cuando se cierra el modal
    modalRef.componentInstance.clienteE.subscribe((resp: any) => {
      console.log(resp);

      this.cliente_nombre = resp.nombres + ' ' + resp.apellidos + '(' + resp.nroDocumento + ')';
      this.cliente_id = resp.id;
      this.cdr.detectChanges(); // Forzar la detección de cambios

    })

  }

  addCliente2() {
    this.cliente_nombre = "hola"
  }
}
