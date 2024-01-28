import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { CotizacionService } from '../_service/cotizacion.service';
import { error } from 'console';
import { AddClienteComponent } from '../../clientes/add-cliente/add-cliente.component';
import { AddDialogClienteComponent } from '../add-dialog-cliente/add-dialog-cliente.component';
import { AuthService } from '../../auth';
import { AddProductComponent } from '../add-product/add-product.component';
@Component({
  selector: 'app-add-new-cotizacion',
  templateUrl: './add-new-cotizacion.component.html',
  styleUrls: ['./add-new-cotizacion.component.scss']
})
export class AddNewCotizacionComponent implements OnInit {


  isLoading$;
  isLoading = false;
  listClientes: any = [];
  totalTemporal: any = 0;

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
  fechaEmision: string = null;
  fechaExpiracion: any = null;
  total: any = null;
  observaciones: any = null;
  cliente_nombre: any = null;
  vendedor_nombre: any = null;
  descuentoGlobal: any = null;

  //resumen
  netoCotizacion: any = 0
  totalCotizacion: any = 0;
  igvCotizacion: any = 0;
  subtotalCotizacion: any = 0;

  //Data productos
  producto_id: any = null;
  cantidad: any = null;
  descuento: any = null;
  listProducto: any = [];


  /* Data Producto */
  nombreProducto: any = null;
  Cantidad: any = null;
  Precio: any = null;

  fechaactual: any = new Date();


  isButtonClicked: boolean = false;
  descuentoHabilitado: boolean = false;
  descuentoGlobalHabilitado: boolean = false;

  usuario: any = null;
  listProductosall: any = null;

  producto_nombre: any = null;


  ngOnInit(): void {
    this.isLoading$ = this._CotizacionService.isLoadingSubject;
    this.allClientes();
    this.vendedor_nombre = this.authservice.user.name + ' ' + this.authservice.user.surname + ' / ' + this.authservice.user.email;
    this.vendedor_id = this.authservice.user.id;
    this.fechaEmision = this.obtenerFechaActual();
    console.log('fecha: ', this.fechaEmision)
  }

  obtenerFechaActual(): string {
    // Obtener la fecha actual en formato 'yyyy-MM-dd'
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0!
    const yyyy = today.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
  }

  addProducto() {

    if (!this.cantidad) {
      this.toaster.open(NoticyAlertComponent, { text: `danger-'El campo cantidad es requerido.'` });
      return;
    }


    let dataProducto = {
      id: 0,
      estado: 1,
      producto_id: this.producto_id,
      nombre: this.producto_nombre,
      precio: this.Precio,
      cantidad: this.cantidad,
      descuentoHabilitado: this.descuentoHabilitado,
      descuento: this.descuento,
      total: (this.cantidad * this.Precio * (100 - this.descuento)) / 100,
    }

    this.totalTemporal = this.totalTemporal + dataProducto.total;
    console.log(this.totalTemporal);
    this.calcularSubTotal();

    this.listProducto.push(dataProducto);
    this.cantidad = null;
    this.descuentoHabilitado = false;
    this.descuento = null;
    this.producto_nombre= null;
    this.Precio = null;
    this.producto_id = null;
    /* console.log('listProducto:', this.listProducto); */


  }

  createCotizacion() {

    if (!this.cliente_nombre) {
      this.toaster.open(NoticyAlertComponent, { text: `danger-'Ingrese un cliente para continuar.'` });
      return;
    }

    if (!this.fechaExpiracion) {
      this.toaster.open(NoticyAlertComponent, { text: `danger-'El campo fecha expiración es requerido.'` });
      return;
    }

    let dataCotizacion = {
      id: 0,
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
      listProducto: this.listProducto

    }
    if (this.descuentoGlobalHabilitado) {
      dataCotizacion.descuento = this.descuentoGlobal;
    }

    console.log('dataCotizacion', dataCotizacion);

    this.save(dataCotizacion);
  }


  save(dataCotizacion: any) {

    this._CotizacionService.createCotizacion(dataCotizacion).subscribe(
      (resp: any) => {
        console.log('Respuesta:', resp);

        if (resp.success) {

          this.toaster.open(NoticyAlertComponent, { text: `primary-'Cotizacion guardado correctamente'` });
          this.resetForm();
          this.cdr.detectChanges(); // Forzar la detección de cambios
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
    this.cliente_nombre = null;
    this.fechaExpiracion = null;
    this.estadoCotizacion = 1;
    this.observaciones = null;
    this.producto_nombre = null;
    this.cantidad = null;
    this.descuentoHabilitado = false;
    this.descuento = null;
    this.listProducto = [];
    this.netoCotizacion = 0;
    this.igvCotizacion = 0;
    this.subtotalCotizacion = 0;
    this.descuentoGlobalHabilitado = false;
    this.descuentoGlobal = null;
    this.totalCotizacion = 0;
    this.totalTemporal = 0;


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


  removeProducto(producto: any) {

    if (producto.id == 0) {
      this.listProducto = this.listProducto.filter((item) => item != producto);
      
      this.totalTemporal = this.totalTemporal - (producto.total);
      
      this.calcularSubTotal();

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

  addProductoDialog() {
    const modalRef = this.modelService.open(AddProductComponent, { centered: true, size: 'lg' });
    // Capturar el resultado cuando se cierra el modal
    
    modalRef.componentInstance.productoE.subscribe((resp: any) => {
      console.log(resp);
      this.producto_id = resp.id;
      this.producto_nombre = resp.title;
      this.Precio = resp.price_soles;
      this.cdr.detectChanges();
    })

  }

  addCliente2() {
    this.cliente_nombre = "hola"
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
