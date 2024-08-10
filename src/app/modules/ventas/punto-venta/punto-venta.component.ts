import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BuscadorRegistradorClientesComponent } from '../../_dialog/buscador-registrador-clientes/buscador-registrador-clientes.component';
import { AuthService } from '../../auth';
import { MatDialog } from '@angular/material/dialog';
import { ServiciosGeneralService } from '../../servicios-general.service';
import { Toaster } from 'ngx-toast-notifications';
import { ConfirmService } from 'src/app/shared/confirm/confirm.service';
import { BuscadorProductosComponent } from '../../_dialog/buscador-productos/buscador-productos.component';
import { CotizacionProductoEntity } from 'src/app/Models/CotizacionEntity';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { FormControl } from '@angular/forms';
import { IGV } from 'src/app/config/config';
import { VentaEntity } from 'src/app/Models/VentaEntity';

@Component({
  selector: 'app-punto-venta',
  templateUrl: './punto-venta.component.html',
  styleUrls: ['./punto-venta.component.scss']
})
export class PuntoVentaComponent implements OnInit {
  isLoading$;
  usuario_dni: string = "";
  vendedor_id: number = 0;
  //Form
  cliente_nombre: string = null;
  vendedor_nombre: string = null;
  cliente_id: number = 0;

  //SUB FORM PRODUCTOS
  producto_nombre: string = null;
  producto_id: number = 0;
  producto_precio: number = 0;
  cantidad: number = 0;
  bTieneDescuento: boolean = false;
  nValorDescuento: number = 0;
  listProducto: CotizacionProductoEntity[] = [];
  listProductoEnv: CotizacionProductoEntity[] = [];

  //FORM RESUMEN
  lstTiposDocumento: any = [
    { nIdTipoDocumento: 1, cNombreDocumento: 'Boleta' },
    { nIdTipoDocumento: 2, cNombreDocumento: 'Factura' }
  ]
  lstTipoPago: any = [
    { nIdTipoPago: 1, cNombreTipoPago: 'Efectivo' },
    { nIdTipoPago: 2, cNombreTipoPago: 'Tarjeta' }
  ]


  cboTipoDocumento: FormControl = new FormControl(1);
  cboTipoPago: FormControl = new FormControl(1);
  bEfectivoExacto: boolean = false;
  txtEfectivoRecibido: FormControl = new FormControl(null);
  txtCodigoOperacion: FormControl = new FormControl(null);
  nValorSubTotal: number = 0;
  nTotal: number = 0;
  nValorDescuentoGeneral: number = 0;
  nValorIGV: number = 0;
  IGV: number = 0;

  bVentaRealizada: boolean = false;
  venta: VentaEntity = null;

  constructor(public authservice: AuthService,
    private _dialog: MatDialog,
    public _service: ServiciosGeneralService,
    private cdr: ChangeDetectorRef,
    public toaster: Toaster,
    public confirmService: ConfirmService,) {
    this.vendedor_nombre = this.authservice.user.name + ' ' + this.authservice.user.surname + ' / ' + this.authservice.user.email;
    this.IGV = IGV;
    this.vendedor_id = this.authservice.user.id;
    this.usuario_dni = this.authservice.user.cDocumento;
  }

  ngOnInit(): void {
    this.isLoading$ = this._service.isLoading$;
  }

  BotonAbrirModalCliente() {
    const dialogRef = this._dialog.open(
      BuscadorRegistradorClientesComponent,
      {
        width: '850px',
        disableClose: true,
        data: {
          bEdit: false,
          cTitle: 'CLIENTES',
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {

        this.cliente_nombre = result.cNombres + result.cApellidos + ' / ' + result.cCorreo;
        this.cliente_id = result.id;
        this.cdr.detectChanges();
      }
    });
  }


  BotonAbrirModalProducto() {
    const dialogRef = this._dialog.open(
      BuscadorProductosComponent,
      {
        width: '850px',
        disableClose: true,
        data: {
          bEdit: false,
          cTitle: 'PRODUCTOS',
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {

        this.producto_nombre = result.cDescripcion;
        this.producto_id = result.id;
        this.producto_precio = result.nPrecioPEN;



        this.cdr.detectChanges();
      }
    });
  }


  BotonAgregarProducto() {


    if (this.producto_id == 0) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Seleccione un Producto para continuar.'` });
      return;
    }

    if (this.cantidad == 0) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Ingrese una cantidad para continuar.'` });
      return;
    }


    if (this.bTieneDescuento && this.nValorDescuento == 0) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Ingrese un valor de descuento mayor a '0' para continuar.'` });
      return;
    }


    const producto = new CotizacionProductoEntity();
    producto.id = 0;
    producto.cotizacion_id = 0;
    producto.producto_id = this.producto_id;
    producto.producto_nombre = this.producto_nombre;
    producto.nCantidad = this.cantidad;
    producto.nPrecioUnitario = this.producto_precio;
    producto.nDescuento = this.nValorDescuento;
    producto.nEstado = 1;
    producto.cUsuarioCreacion = this.usuario_dni;
    producto.cUsuarioModificacion = this.usuario_dni;

    producto.nTotalConDescuento = parseFloat((((100 - producto.nDescuento) * (producto.nCantidad * producto.nPrecioUnitario)) / 100).toFixed(2));
    producto.nTotalSinDescuento = parseFloat((((producto.nCantidad * producto.nPrecioUnitario))).toFixed(2));
    producto.nTotalDescuento = parseFloat((((producto.nDescuento) * (producto.nCantidad * producto.nPrecioUnitario)) / 100).toFixed(2));
    this.listProducto.push(producto);
    this.listProductoEnv.push(producto);
    console.log(this.listProducto);

    this.producto_id = 0;
    this.producto_nombre = null;
    this.producto_precio = 0;

    this.cantidad = 0;
    this.bTieneDescuento = false;
    this.nValorDescuento = 0;
    this.CalcularResumen();



  }

  BotonEliminarProducto(producto) {

    var title = 'Eliminar Producto: ' + producto.producto_nombre;
    var mensaje = '¿Está seguro que desea eliminar este producto?';

    this.confirmService.confirmarEliminacion({ title: title, message: mensaje })
      .subscribe(result => {
        if (result) {
          if (producto.id > 0) {
            this.listProductoEnv.push(producto, { ...producto, nEstado: 0 })
          } else {
            this.listProductoEnv = this.listProductoEnv.filter(x => x != producto);
          }

          this.listProducto = this.listProducto.filter(x => x != producto);
          this.CalcularResumen();
        }

      });


  }




  CalcularResumen(): void {

    this.nValorSubTotal = this.listProducto.reduce((acc, producto) => acc + Number(producto.nTotalSinDescuento), 0);
    this.nTotal = this.listProducto.reduce((acc, producto) => acc + Number(producto.nTotalConDescuento), 0);
    this.nValorDescuentoGeneral = parseFloat((this.nValorSubTotal - this.nTotal).toFixed(2));
    this.nValorIGV = parseFloat((this.nValorSubTotal * this.IGV).toFixed(2));
    this.nValorSubTotal = parseFloat((this.nValorSubTotal - this.nValorIGV).toFixed(2));


  }


  GuardarVenta() {
    if (!this.cliente_nombre) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Ingrese un cliente para continuar.'` });
      return;
    }

    if (this.listProducto.length == 0) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Agregue uno o más productos para continuar.'` });
      return;
    }

    if (this.cboTipoPago.value == 1 && !this.txtEfectivoRecibido.value) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Ingrese una cantidad de efectivo para continuar.'` });
      return;
    }

    if (this.cboTipoPago.value == 2 && !this.txtCodigoOperacion.value) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Ingrese el código de operación para continuar.'` });
      return;
    }

    if ((this.txtEfectivoRecibido.value && this.nTotal) && this.txtEfectivoRecibido.value < this.nTotal) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Efectivo Recibido Insuficiente.'` });
      return;
    }

    const venta = new VentaEntity();
    venta.id = 0;
    venta.nTipoOrigen = 1;
    venta.cliente_id = this.cliente_id;
    venta.vendedor_id = this.vendedor_id;
    venta.cCorrelativo = '';
    venta.nTipoComprobante = this.cboTipoDocumento.value;
    venta.nTipoPago = this.cboTipoPago.value;
    venta.nEfectivoRecibido = this.txtEfectivoRecibido.value;
    venta.bEfectivoExacto = this.bEfectivoExacto;
    venta.nVuelto = this.txtEfectivoRecibido.value - this.nTotal;
    venta.cCodigoOperacion = this.txtCodigoOperacion.value;
    venta.nSubTotal = this.nValorSubTotal;
    venta.IGV = this.IGV;
    venta.nValorIGV = this.nValorIGV;
    venta.nDescuento = this.nValorDescuentoGeneral;
    venta.nTotal = this.nTotal;
    venta.nEstado = 1;
    venta.cUsuarioCreacion = this.usuario_dni;
    venta.cUsuarioModificacion = this.usuario_dni;
    venta.listProductos = this.listProductoEnv;



    this._service.PostVenta(venta).subscribe((resp: any) => {
      console.log(resp);
      if (resp.success) {
        this.toaster.open(NoticyAlertComponent, { text: `primary-La Venta se registró exitosamente.` });
        this.bVentaRealizada = true;
        this.venta = resp.venta;
        /* console.log('resp.venta.cCorrelativo', resp.venta.cCorrelativo);
        console.log('resp.venta.cCorrelativo', resp.venta); */
        /*   this.cotizacion_id = resp.cotizacion.id;
          this.cTitle = 'Editar Cotización: ' + resp.cotizacion.cCorrelativo;
          this.bEdit = true;
          this.ObtenerCotizacionPorId(this.cotizacion_id); */

      } else {
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al registrar la Venta.'` });
      }
    },
      (error: any) => {
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al registrar la Venta.'` });
        return;
      }
    )
  }

  ObtenerVentaPorId(id: number) {
    setTimeout(() => {

      /*   this.cdr.detectChanges(); */
      this._service.GetVentaPorId(id).subscribe((resp: any) => {

        console.log(resp);
        this.venta = resp.detalle_venta;
        this.cboTipoDocumento.setValue(this.venta.nTipoComprobante);
        this.cboTipoPago.setValue(this.venta.nTipoPago);
        this.txtEfectivoRecibido.setValue(this.venta.nEfectivoRecibido);
        this.bEfectivoExacto = this.venta.bEfectivoExacto;
        this.nValorSubTotal = this.venta.nSubTotal;
        this.nValorIGV = this.venta.nValorIGV;
        this.nValorDescuentoGeneral = this.venta.nDescuento;
        this.nTotal = this.venta.nTotal;
        this.txtCodigoOperacion.setValue(this.venta.cCodigoOperacion);

        this.bVentaRealizada = true;
        this.listProducto = resp.listProductos;
        this.cliente_nombre = this.venta.cClienteCorreo;
        this.vendedor_nombre = this.venta.cVendedorCorreo;

        this.cdr.detectChanges();




        /*  this.cdr.detectChanges(); */

      })
    }, 10);
  }

}
