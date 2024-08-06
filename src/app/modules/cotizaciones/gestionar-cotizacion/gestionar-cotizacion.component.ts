import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IGV, URL_BACKEND } from 'src/app/config/config';
import { ServiciosGeneralService } from '../../servicios-general.service';
import { AuthService } from '../../auth';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { BuscadorRegistradorClientesComponent } from '../../_dialog/buscador-registrador-clientes/buscador-registrador-clientes.component';
import { CotizacionEntity, CotizacionProductoEntity } from 'src/app/Models/CotizacionEntity';
import { ClienteEntity } from 'src/app/Models/ClienteEntity';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { BuscadorProductosComponent } from '../../_dialog/buscador-productos/buscador-productos.component';
import { ConfirmService } from 'src/app/shared/confirm/confirm.service';


@Component({
  selector: 'app-gestionar-cotizacion',
  templateUrl: './gestionar-cotizacion.component.html',
  styleUrls: ['./gestionar-cotizacion.component.scss']
})
export class GestionarCotizacionComponent implements OnInit {
  //Variables comunes

  usuario_dni: string = "";
  IGV: number = 0;
  isLoading$;
  search: any = null;
  filteredCotizaciones: any = [];

  cotizaciones: any = [];
  URL_BACKEND: any = URL_BACKEND;

  pageSize = 5;
  desde: number = 0;
  hasta: number = 5;


  //variables filtro
  cboEstado: FormControl = new FormControl(-1);
  cCorrelativo: FormControl = new FormControl(null);
  startDate: FormControl = new FormControl(null);
  endDate: FormControl = new FormControl(null);

  //listas
  lstEstados = [
    { nIdEstado: -1, cEstado: 'Todos' },
    { nIdEstado: 1, cEstado: 'Registrado' },
    { nIdEstado: 2, cEstado: 'Enviado' },
    { nIdEstado: 3, cEstado: 'Rechazado' },
    { nIdEstado: 0, cEstado: 'Inactivo' },
  ];
  bNuevo: boolean = false;
  cTitle: string = '';

  //Form
  cliente_nombre: string = null;
  dFechaEmision: any = null;
  dFechaExpiracion: any = null;
  nEstado: number = 1;
  vendedor_nombre: string = null;
  cObservaciones: string = null;

  nTotal: number = 0;
  /*  nPreTotal: number = 0; */

  cliente_id: number = 0;
  vendedor_id: number = 0;
  cotizacion_id: number = 0;
  bEdit: boolean = false;
  cotizacion: CotizacionEntity = null;

  //SUB FORM PRODUCTOS
  producto_nombre: string = null;
  producto_id: number = 0;
  producto_precio: number = 0;
  cantidad: number = 0;
  bTieneDescuento: boolean = false;
  nValorDescuento: number = 0;

  listProducto: CotizacionProductoEntity[] = [];
  listProductoEnv: CotizacionProductoEntity[] = [];
  nValorIGV: number = 0;
  nValorSubTotal: number = 0;

  nValorDescuentoGeneral: number = 0;

  constructor(
    public authservice: AuthService,
    private _dialog: MatDialog,
    public _service: ServiciosGeneralService,
    private cdr: ChangeDetectorRef,
    public toaster: Toaster,
    public confirmService: ConfirmService,
  ) {

    this.BotonListarCotizaciones();
    this.vendedor_nombre = this.authservice.user.name + ' ' + this.authservice.user.surname + ' / ' + this.authservice.user.email;
    this.vendedor_id = this.authservice.user.id;
    this.usuario_dni = this.authservice.user.cDocumento;
    this.IGV = IGV;
  }

  ngOnInit(): void {

    this.isLoading$ = this._service.isLoading$;
  }

  BuscadorCotizaciones() {
    const cotizacionesFiltrados = this.cotizaciones.filter(cotizacion =>
      cotizacion.cNombreCliente.toLowerCase().includes(this.search.toLowerCase()) ||
      cotizacion.cNombreVendedor.toLowerCase().includes(this.search.toLowerCase())
    );
    this.filteredCotizaciones = cotizacionesFiltrados;
    this.desde = 0;
    this.hasta = this.pageSize;
  }

  BotonListarCotizaciones() {
    this.search = null;
    this._service.GetCotizaciones(
      this.cboEstado.value,
      this.cCorrelativo.value,
      this.startDate.value,
      this.endDate.value


    ).subscribe((resp: any) => {

      this.cotizaciones = resp.cotizaciones;
      this.filteredCotizaciones = [...this.cotizaciones];
    })
  }

  BotonLimpiarFiltros() {
    this.search = null;

    this.cboEstado.setValue(-1);
    this.cCorrelativo.setValue(null);
    this.startDate.setValue(null);
    this.endDate.setValue(null);
    this.BotonListarCotizaciones();

  }

  cambiarPagina(e: PageEvent) {
    /*   console.log(e); */
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }



  BotonRegistrarCotizacion() {
    this.bNuevo = true;
    this.cTitle = "Registrar Nueva Cotización";
    this.vendedor_nombre = this.authservice.user.name + ' ' + this.authservice.user.surname + ' / ' + this.authservice.user.email;
    this.vendedor_id = this.authservice.user.id;
  }

  BotonEditarCotizacion(cotizacion_id: number) {
    this.bNuevo = true;
    this.vendedor_nombre = this.authservice.user.name + ' ' + this.authservice.user.surname + ' / ' + this.authservice.user.email;
    this.vendedor_id = this.authservice.user.id;
    this.ObtenerCotizacionPorId(cotizacion_id);
  }

  ObtenerCotizacionPorId(id: number) {
    this.listProductoEnv = [];

    this._service.GetCotizacionPorId(id).subscribe((resp: any) => {
      console.log('cotizacion: ', resp);

      this.cotizacion = resp.cotizacion;
      this.listProducto = resp.listProductos;
      this.bEdit = true;
      this.cTitle = 'Editar Cotización: ' + this.cotizacion.cCorrelativo;
      this.cotizacion_id = this.cotizacion.id;
      this.cliente_id = this.cotizacion.cliente_id;
      this.cliente_nombre = this.cotizacion.cClienteCorreo;

      this.dFechaEmision = this.cotizacion.dFechaEmision;
      this.dFechaExpiracion = this.cotizacion.dFechaExpiracion;
      this.nEstado = this.cotizacion.nEstado;
      this.cObservaciones = this.cotizacion.cObservaciones;


      this.CalcularResumenCotizacion();
      this.cdr.detectChanges();

    })
  }

  BotonVolver() {
    this.bNuevo = false;
    this.ResetForm();
    this.BotonListarCotizaciones();
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



  ResetForm() {
    this.cliente_nombre = null;
    this.dFechaEmision = null;
    this.dFechaExpiracion = null;
    this.nEstado = 1;
    this.vendedor_nombre = null;
    this.cObservaciones = null;
    this.nValorSubTotal = 0;
    this.nValorIGV = 0;
    this.nValorDescuentoGeneral = 0;
    this.nTotal = 0;
    this.bEdit = false;
    this.listProducto = [];
  }

  BotonExportar() {

  }
  BotonGuardar() {

    if (!this.cliente_nombre || !this.dFechaEmision || !this.dFechaExpiracion) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Complete todos los campos obligatorios para continuar.'` });
      return;
    }


    const cotizacion = new CotizacionEntity();
    cotizacion.id = 0;
    cotizacion.cliente_id = this.cliente_id;
    cotizacion.vendedor_id = this.vendedor_id;
    cotizacion.cCorrelativo = '';
    cotizacion.dFechaEmision = this.dFechaEmision;
    cotizacion.dFechaExpiracion = this.dFechaExpiracion;
    cotizacion.nTotal = this.nTotal;
    cotizacion.cObservaciones = this.cObservaciones;
    cotizacion.nValorDescuento = this.nValorDescuentoGeneral;
    cotizacion.nEstado = this.nEstado;
    cotizacion.cUsuarioCreacion = this.usuario_dni;
    cotizacion.cUsuarioModificacion = this.usuario_dni;
    cotizacion.listProductos = this.listProductoEnv;

    console.log('cotizacion: ', cotizacion);

    this._service.PostCotizacion(cotizacion).subscribe((resp: any) => {
      console.log(resp);
      if (resp.success) {
        this.toaster.open(NoticyAlertComponent, { text: `primary-La Cotización se registró exitosamente.` });
        this.cotizacion_id = resp.cotizacion.id;
        this.cTitle = 'Editar Cotización: ' + resp.cotizacion.cCorrelativo;
        this.bEdit = true;
        this.ObtenerCotizacionPorId(this.cotizacion_id);

      } else {
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al guardar la Cotización.'` });
      }
    },
      (error: any) => {
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al registrar el Proveedor.'` });
        return;
      }
    )
  }

  BotonActualizar() {

    if (!this.dFechaEmision || !this.dFechaExpiracion) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Complete todos los campos obligatorios para continuar.'` });
      return;
    }

    const cotizacion = new CotizacionEntity();
    cotizacion.id = this.cotizacion_id;
    cotizacion.cliente_id = this.cliente_id;
    cotizacion.vendedor_id = this.vendedor_id;
    cotizacion.dFechaEmision = this.dFechaEmision;
    cotizacion.dFechaExpiracion = this.dFechaExpiracion;
    cotizacion.nTotal = this.nTotal;
    cotizacion.cObservaciones = this.cObservaciones;
    cotizacion.nValorDescuento = this.nValorDescuentoGeneral;
    cotizacion.nEstado = this.nEstado;
    cotizacion.cUsuarioCreacion = this.usuario_dni;
    cotizacion.cUsuarioModificacion = this.usuario_dni;
    cotizacion.listProductos = this.listProductoEnv;

    console.log('cotizacion: ', cotizacion);

    this._service.PutCotizacion(this.cotizacion_id, cotizacion).subscribe((resp: any) => {
      console.log(resp);
      if (resp.success) {

        this.toaster.open(NoticyAlertComponent, { text: `success-'Cotización actualizada correctamente'` });
        this.ObtenerCotizacionPorId(this.cotizacion_id);

      } else {
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar la Cotización.'` });
      }
    },
      (error: any) => {
        console.log(error);
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar la Cotización.'` });
        return;
      }

    )
  }

  BotonEliminarCotizacion(cotizacion: CotizacionEntity) {
    var title = 'Eliminar Cotización: ' + cotizacion.cCorrelativo;
    var mensaje = '¿Está seguro que desea eliminar esta cotización?';


    //llamamos al servicio de confirmarEliminacion y le pasamos parámetros
    this.confirmService.confirmarEliminacion({ title: title, message: mensaje })
      .subscribe(result => {
        if (result) {
          /* Colocar aquí procedimiento al confirmar elimninación */

          this._service.RemoveCotizacion(cotizacion).subscribe(
            (resp: any) => {

              if (resp.success) {
                this.toaster.open(NoticyAlertComponent, { text: `info-La cotización se actualizó exitosamente.` });
                cotizacion.nEstado = 0;

                if (this.cboEstado.value !== -1 && this.cboEstado.value !== 1) {
                  this.filteredCotizaciones = this.filteredCotizaciones.filter(x => x !== cotizacion);
                }


              } else {
                this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar la Cotización.'` });
              }
            },
            (error: any) => {
              console.error('Error al actualizar la Cotización:', error);
              this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar la Cotización.'` });

            }
          )
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
    this.CalcularResumenCotizacion();




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
          this.CalcularResumenCotizacion();
        }

      });


  }


  CalcularResumenCotizacion(): void {

    this.nValorSubTotal = this.listProducto.reduce((acc, producto) => acc + Number(producto.nTotalSinDescuento), 0);
    this.nTotal = this.listProducto.reduce((acc, producto) => acc + Number(producto.nTotalConDescuento), 0);
    this.nValorDescuentoGeneral = parseFloat((this.nValorSubTotal - this.nTotal).toFixed(2));
    this.nValorIGV = parseFloat((this.nValorSubTotal * this.IGV).toFixed(2));
    this.nValorSubTotal = parseFloat((this.nValorSubTotal - this.nValorIGV).toFixed(2));


  }
}
