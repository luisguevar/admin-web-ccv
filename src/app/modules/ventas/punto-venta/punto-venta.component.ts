import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { BuscadorRegistradorClientesComponent } from '../../_dialog/buscador-registrador-clientes/buscador-registrador-clientes.component';
import { AuthService } from '../../auth';
import { MatDialog } from '@angular/material/dialog';
import { ServiciosGeneralService } from '../../servicios-general.service';
import { Toaster } from 'ngx-toast-notifications';
import { ConfirmService } from 'src/app/shared/confirm/confirm.service';
import { BuscadorProductosComponent } from '../../_dialog/buscador-productos/buscador-productos.component';
import { CotizacionProductoEntity } from 'src/app/Models/CotizacionEntity';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IGV } from 'src/app/config/config';
import { VentaEntity } from 'src/app/Models/VentaEntity';
import { ProgressComponent } from '../progress/progress.component';
import { ConfirmadorEliminadorObservacionComponent } from '../../_dialog/confirmador-eliminador-observacion/confirmador-eliminador-observacion.component';

@Component({
  selector: 'app-punto-venta',
  templateUrl: './punto-venta.component.html',
  styleUrls: ['./punto-venta.component.scss']
})
export class PuntoVentaComponent implements OnInit {
  @ViewChild('progress') progress: ProgressComponent;

  testForm = new FormGroup({
    food: new FormControl('', Validators.required),
    comment: new FormControl('', Validators.required),
  });

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
  bPedidoCancelado: boolean = false;

  cObservaciones: string = '';
  bHerencia: boolean = false;
  nEstadoActual: number = 1;
  bCompletado: boolean = false;

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

  GuardarEstado() {

    const venta = new VentaEntity();

    venta.nEstado = this.nEstadoActual;
    venta.cUsuarioModificacion = this.usuario_dni;;

    this._service.PutEstadoVenta(this.venta.id, venta).subscribe((resp: any) => {
      console.log(resp);
      if (resp.success) {

        this.toaster.open(NoticyAlertComponent, { text: `success-'Pedido actualizado correctamente'` });
        /* this.ObtenerVentaPorId(resp.id); */

      } else {
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar el estado del Pedido.'` });
      }
    },
      (error: any) => {
        console.log(error);
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar el estado del Pedido.'` });
        return;
      }

    )

  }

  GuardarEstadoEntregado() {

    this.bCompletado = true;
  
    
    const venta = new VentaEntity();

    venta.nEstado = 4;
    venta.bCompletado = true;
    venta.cUsuarioModificacion = this.usuario_dni;;

    this._service.PutEstadoVenta(this.venta.id, venta).subscribe((resp: any) => {
      console.log(resp);
      if (resp.success) {

        this.toaster.open(NoticyAlertComponent, { text: `success-'Pedido actualizado correctamente'` });

        /* this.ObtenerVentaPorId(resp.id); */

      } else {
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar el estado del Pedido.'` });
      }
    },
      (error: any) => {
        console.log(error);
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar el estado del Pedido.'` });
        return;
      }

    )

  }
  onStateChange(event) {

    this.nEstadoActual = event.activeIndex;

  }

  ngAfterViewInit() { }

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
      /*   this.progress.next(); */
        this.cdr.detectChanges();
        
/*         this.ObtenerVentaPorId(venta.id); */

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

  LoadComponente(id: number, bFlag: boolean = false) {
    this.bHerencia = true;
    this.ObtenerVentaPorId(id);
  }

  ObtenerVentaPorId(id: number) {
    setTimeout(() => {

      /*   this.cdr.detectChanges(); */
      this._service.GetVentaPorId(id).subscribe((resp: any) => {

        console.log(resp);
        this.venta = resp.detalle_venta;
        
        this.bCompletado  = this.venta.bCompletado;
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
        if (this.venta.nEstado != 5) {
          setTimeout(() => {
            if (this.progress) {
              // Avanzar hasta el paso 3 (hacer clic 3 veces en "Avanzar")
              for (let i = 0; i < this.venta.nEstado; i++) {
                this.progress.next();
              }
            }
          }, 100);
        } else {
          this.bPedidoCancelado = true;
          this.cObservaciones = this.venta.cObservaciones;
        }


        this.cdr.detectChanges();




        /*  this.cdr.detectChanges(); */

      })
    }, 10);
  }



  BotonCancelarPedido() {
    const dialogRef = this._dialog.open(
      ConfirmadorEliminadorObservacionComponent,
      {
        width: '650px',
        disableClose: true,
        data: {
          bEdit: false,
          cTitle: 'Cancelar Pedido',
          id: this.venta.id
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ObtenerVentaPorId(this.venta.id);

      }

    });
  }



}
