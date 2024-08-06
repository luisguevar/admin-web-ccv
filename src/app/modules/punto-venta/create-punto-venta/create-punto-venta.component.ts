import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../auth';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { Toaster } from 'ngx-toast-notifications';
import { BuscadorRegistradorClientesComponent } from '../../_dialog/buscador-registrador-clientes/buscador-registrador-clientes.component';
import { BuscadorProductosComponent } from '../../_dialog/buscador-productos/buscador-productos.component';

@Component({
  selector: 'app-create-punto-venta',
  templateUrl: './create-punto-venta.component.html',
  styleUrls: ['./create-punto-venta.component.scss']
})
export class CreatePuntoVentaComponent implements OnInit {

  cliente_nombre: string = null;
  vendedor_nombre: any = null;

  //PRODUCTOS
  lstProductos: any = [];
  producto_nombre: any = null;
  cantidad: number = 0;
  cboTipoDocumento: any = 1;

  cboTipoPago = new FormControl('1');
  bPagoEfectivo: boolean = true;
  bPagoTarjeta: boolean = false;
  producto_id: any;
  precio: any;
  cliente_id: any;
  vendedor_id: any;




  nStock: number = 3;
  bCantidad: boolean = true;
  totalVenta: number = 0;
  subTotal: number = 0;
  Igv: number = 0;
  valorIgv: number = 0.18;

  mostrarVuelto = false;

  efectivoRecibido: number = 0;
  vuelto: number = 0;
  descuentoGlobalHabilitado: boolean = false;
  descuentoGlobal: number = 0;
  totalTemporal: number = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    public modelService: NgbModal,
    public authservice: AuthService,
    public toaster: Toaster,
  ) { }

  ngOnInit(): void {
    this.cboTipoPago.valueChanges.subscribe(value => {


      if (value === '1') {
        this.bPagoEfectivo = true;
        this.bPagoTarjeta = false;
      } else {
        this.bPagoTarjeta = true;
        this.bPagoEfectivo = false;
        this.efectivoRecibido = 0;
        this.mostrarVuelto = false;
      }

      /* console.log('bPagoEfectivo: ', this.bPagoEfectivo);
      console.log('bPagoTarjeta: ', this.bPagoTarjeta); */
    });
    this.vendedor_nombre = this.authservice.user.name + ' ' + this.authservice.user.surname + ' / ' + this.authservice.user.email;
    this.vendedor_id = this.authservice.user.id;
  }

  addClienteDialog() {
    const modalRef = this.modelService.open(BuscadorRegistradorClientesComponent, { centered: true, size: 'lg' });
    // Capturar el resultado cuando se cierra el modal
    modalRef.componentInstance.clienteE.subscribe((resp: any) => {
      console.log(resp);

      this.cliente_nombre = resp.nombres + ' ' + resp.apellidos + '(' + resp.nroDocumento + ')';
      this.cliente_id = resp.id;
      this.cdr.detectChanges(); // Forzar la detección de cambios
      console.log(this.cliente_nombre);
    })

  }

  addProductoDialog() {
    const modalRef = this.modelService.open(BuscadorProductosComponent, { centered: true, size: 'lg' });
    // Capturar el resultado cuando se cierra el modal

    modalRef.componentInstance.productoE.subscribe((resp: any) => {
      console.log(resp);
      if (resp.id) {
        this.producto_id = resp.id;
        this.producto_nombre = resp.title + ' (' + resp.stock + ')';
        this.precio = resp.price_soles;
        this.nStock = resp.stock;
        this.bCantidad = false;
        this.cdr.detectChanges();

      }

    })

  }

  actualizarCantidad() {
    if (this.cantidad == this.nStock) {

      this.toaster.open(NoticyAlertComponent, { text: `warning-Se alcanzó el stock máximo para este producto` });
      return;
    }
  }


  addProducto() {

    if (!this.producto_nombre) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-Ingrese un producto para continuar.` });
      return;
    }

    if (this.cantidad < 1) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-Ingrese una cantidad válida para continuar.` });
      return;
    }

    if (this.cantidad > this.nStock) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-La cantidad ingresada supera el stock disponible.` });
      return;
    }


    const productoEncontrado = this.lstProductos.find(producto => producto.producto_id === this.producto_id);

    if (productoEncontrado) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-El producto ya se encuentra registrado.` });
      return;
    }

    const newProducto = {
      producto_id: this.producto_id,
      producto_nombre: this.producto_nombre,
      cantidad: this.cantidad,
      stock: this.nStock,
      precio: this.precio,
      total: this.cantidad * this.precio

    }

    this.totalTemporal = this.totalTemporal + newProducto.total;
    this.totalVenta = this.totalTemporal;
    this.calcularSubTotal(this.totalVenta);

    this.lstProductos.push(newProducto);
    this.cantidad = 0;
    this.producto_nombre = null;
    this.bCantidad = true;
    this.efectivoRecibido = 0;
    this.mostrarVuelto = false;
    this.descuentoGlobalHabilitado = false;
    this.descuentoGlobal = 0;

  }

  removeproducto(producto: any) {


    this.descuentoGlobalHabilitado = false
    this.descuentoGlobal = 0;
    this.totalVenta = this.totalTemporal;
    this.totalVenta = this.totalVenta - producto.total;
    this.totalTemporal = this.totalVenta;
    this.lstProductos = this.lstProductos.filter((item) => item != producto);
    this.calcularSubTotal(this.totalVenta);
    this.efectivoRecibido = 0;
    this.mostrarVuelto = false;

  }


  calcularSubTotal(total) {

    this.subTotal = total / (1 + this.valorIgv);
    this.Igv = this.valorIgv * this.subTotal;

    // Redondear a 2 decimales
    this.subTotal = +this.subTotal.toFixed(2);
    this.Igv = +this.Igv.toFixed(2);

  }

  verificarMonto() {
    if (this.efectivoRecibido > this.totalVenta) {
      this.mostrarVuelto = true;
    } else {
      this.mostrarVuelto = false;
    }

    this.vuelto = this.efectivoRecibido - this.totalVenta;
  }

  onCheckboxChangeDescuentoGlobal() {
    if (!this.descuentoGlobalHabilitado) {
      this.descuentoGlobal = 0;
      this.totalVenta = this.totalTemporal;
    }
    else {
      this.descuentoGlobal = 0;
      this.totalVenta = this.totalTemporal * (100 - this.descuentoGlobal) / 100;
    }

  }

  calcularDescuento() {
    this.totalVenta = this.totalTemporal * (100 - this.descuentoGlobal) / 100;
  }


  aumentar(producto) {
    const stock = producto.stock;

    // Verificar que la cantidad no supere al stock
    if (producto.cantidad < stock) {
      producto.cantidad = producto.cantidad + 1;
      producto.total = producto.cantidad * producto.precio;
      const total = this.lstProductos.reduce((total, producto) => total + producto.total, 0);
      this.totalVenta = total;
      this.totalTemporal = total;
      this.descuentoGlobalHabilitado = false;
      this.descuentoGlobal = 0;
      this.efectivoRecibido = 0;
      this.mostrarVuelto = false;
      this.calcularSubTotal(total);

    }
  }

  disminuir(producto) {
    // Verificar que la cantidad no sea 0
    if (producto.cantidad > 1) {
      producto.cantidad = producto.cantidad - 1;
      producto.total = producto.cantidad * producto.precio;
      const total = this.lstProductos.reduce((total, producto) => total + producto.total, 0);
      this.totalVenta = total;
      this.totalTemporal = total;
      this.descuentoGlobalHabilitado = false;
      this.descuentoGlobal = 0;
      this.efectivoRecibido = 0;
      this.mostrarVuelto = false;
      this.calcularSubTotal(total);

    }
  }

}
