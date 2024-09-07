import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Toaster } from 'ngx-toast-notifications';
import { AuthService } from '../../auth';
import { ServiciosGeneralService } from '../../servicios-general.service';
import { PageEvent } from '@angular/material/paginator';
import { ProveedorContactoEntity, ProveedorEntity } from 'src/app/Models/ProveedorEntity';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { ConfirmService } from 'src/app/shared/confirm/confirm.service';
import { MatDialog } from '@angular/material/dialog';
import { AddEditContactoComponent } from '../add-edit-contacto/add-edit-contacto.component';
import { AddEditProductoComponent } from '../../productos/add-edit-producto/add-edit-producto.component';

@Component({
  selector: 'app-gestionar-proveedor',
  templateUrl: './gestionar-proveedor.component.html',
  styleUrls: ['./gestionar-proveedor.component.scss']
})
export class GestionarProveedorComponent implements OnInit {

  isLoading$;
  search: any = null;
  //paginacion
  pageSize = 5;
  desde: number = 0;
  hasta: number = 5;

  vendedor_nombre: string = null;
  cTitle: string = "";

  proveedores: any = [];
  filteredProveedores: any = [];


  bNuevo: boolean = false;
  //filtro
  cboEstado: FormControl = new FormControl(1);
  cboEstadoItem: FormControl = new FormControl(1);

  //listas
  lstEstados = [
    { nIdEstado: -1, cEstado: 'Todos' },
    { nIdEstado: 1, cEstado: 'Activo' },
    { nIdEstado: 0, cEstado: 'Inactivo' },
  ];
  lstEstadosItem = [
    { nIdEstado: 1, cEstado: 'Activo' },
    { nIdEstado: 0, cEstado: 'Inactivo' },
  ];

  //form
  nTipoPersona: number = 2;
  nTipoDocumento: number = 2;
  cNroDocumento: string = null;
  cRazonSocial: string = null;
  cCelular: string = null;
  email: string = null;
  cPaginaWeb: string = null;
  cDireccion: string = null;
  cActividadPrincipal: string = null;
  cObservaciones: string = null;
  usuario_dni: string = "";
  myForm: FormGroup;

  //
  itemProveedor: ProveedorEntity;
  proveedor_id: number = 0;
  bEdit: boolean = false;
  listContactos: ProveedorContactoEntity[] = [];
  listContactosv2: ProveedorContactoEntity[] = [];
  listContactosEnvio: ProveedorContactoEntity[] = [];

  listProductos: any;

  //Excel
  private _workbook: Workbook
  proveedor: any = null;
  contactos: any = [];
  productos: any = [];

  constructor(
    public toaster: Toaster,
    public authservice: AuthService,
    public _service: ServiciosGeneralService,
    public confirmService: ConfirmService,
    public fb: FormBuilder,
    private _dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {


    this.BotonListarProveedores();
    this.vendedor_nombre = this.authservice.user.name + ' ' + this.authservice.user.surname + ' / ' + this.authservice.user.email;
    this.usuario_dni = this.authservice.user.cDocumento;
    this.myForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    })
  }

  ngOnInit(): void {
    this.isLoading$ = this._service.isLoading$;
  }

  public BotonListarProveedores() {
    this.desde = 0;
    this.hasta = 5;
    this.search = '';
    this._service.GetProveedores(this.cboEstado.value).subscribe((resp: any) => {
      console.log('PROVEEDORES. ', resp);
      this.proveedores = resp.proveedores;
      this.filteredProveedores = [...this.proveedores];
    })
  }

  public BotonNuevoProveedor() {
    this.bNuevo = true;
    this.cTitle = "Registrar Nuevo Proveedor";
  }

  public BotonEditarProveedor(element: ProveedorEntity) {
    this.bNuevo = true;
    this.cTitle = "Editar Proveedor";
    this.bEdit = true;
    this.ObtenerProveedorPorId(element.id);
  }

  get f() { return this.myForm.controls; }

  public ObtenerProveedorPorId(id: number) {

    this._service.GetProveedorPorId(id).subscribe((resp: any) => {
      console.log('proveedor: ', resp);
      this.itemProveedor = resp.proveedor;
      this.listContactos = resp.contactos;
      this.listProductos = resp.productos.data;
      this.proveedor_id = resp.proveedor.id;
      this.nTipoPersona = resp.proveedor.nTipoPersona;
      this.nTipoDocumento = resp.proveedor.nTipoDocumento;
      this.cNroDocumento = resp.proveedor.cNroDocumento;
      this.cRazonSocial = resp.proveedor.cRazonSocial;
      this.cCelular = resp.proveedor.cCelular;
      /* this.cCorreo = resp.proveedor.cCorreo; */
      this.f.email.setValue(resp.proveedor.cCorreo);
      this.cPaginaWeb = resp.proveedor.cPaginaWeb;
      this.cDireccion = resp.proveedor.cDireccion;
      this.cActividadPrincipal = resp.proveedor.cActividadPrincipal;
      this.cObservaciones = resp.proveedor.cObservaciones;
      this.cboEstadoItem.setValue(resp.proveedor.nEstado);


    })
  }




  public BotonDescargarFicha(proveedor: ProveedorEntity) {
    this._service.GetProveedorPorId(proveedor.id).subscribe((resp: any) => {
      console.log('itemProveedor: ', resp.proveedor);
      this.itemProveedor = resp.proveedor;
      this.listContactos = resp.contactos;
      this.listContactosv2 = resp.contactos.filter(x => x.nEstado == 1);
      this.listProductos = resp.productos.data;
      this.DescargarExcel();
      /*  this.listaContactos = resp.contactos;
       this.listaProductos = resp.productos.data; */
    })


  }



  public BotonGuardarProveedor() {

    if (!this.cRazonSocial || !this.cActividadPrincipal || !this.cCelular || !this.cNroDocumento) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Complete todos los campos obligatorios para continuar.'` });
      return;
    }

    if (this.f.email.errors) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Inserte un correo válido.'` });
      return;
    }


    const proveedor = new ProveedorEntity();
    proveedor.id = 0;
    proveedor.cRazonSocial = this.cRazonSocial;
    proveedor.nTipoPersona = this.nTipoPersona;
    proveedor.nTipoDocumento = this.nTipoPersona;
    proveedor.cNroDocumento = this.cNroDocumento;
    proveedor.cCelular = this.cCelular;
    proveedor.cCorreo = this.f.email.value;
    proveedor.cPaginaWeb = this.cPaginaWeb;
    proveedor.cDireccion = this.cDireccion;
    proveedor.cActividadPrincipal = this.cActividadPrincipal;
    proveedor.cObservaciones = this.cObservaciones;
    proveedor.nEstado = this.cboEstadoItem.value;
    proveedor.cUsuarioCreacion = this.usuario_dni;
    proveedor.cUsuarioModificacion = this.usuario_dni;
    proveedor.listContactos = this.listContactosEnvio;

    /* console.log('Modelo Para Guardar: ', proveedor); */

    this._service.PostProveedor(proveedor).subscribe((resp: any) => {

      console.log(resp);
      if (resp.success) {
        this.toaster.open(NoticyAlertComponent, { text: `primary-El Proveedor se registró exitosamente.` });

        this.proveedor_id = resp.proveedor.id;
        this.bEdit = true;

        this.ObtenerProveedorPorId(this.proveedor_id);
        this.listContactosEnvio = [];

      } else {
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al guardar el Proveedor.'` });
      }
    },
      (error: any) => {
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al registrar el Proveedor.'` });
        return;
      }
    )
  }


  public BotonActualizarProveedor() {

    if (!this.cRazonSocial || !this.cActividadPrincipal || !this.cCelular || !this.cNroDocumento) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Complete todos los campos obligatorios para continuar.'` });
      return;
    }

    if (this.f.email.errors) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Inserte un correo válido.'` });
      return;
    }


    const proveedor = new ProveedorEntity();
    proveedor.id = this.proveedor_id;
    proveedor.cRazonSocial = this.cRazonSocial;
    proveedor.nTipoPersona = this.nTipoPersona;
    proveedor.nTipoDocumento = this.nTipoPersona;
    proveedor.cNroDocumento = this.cNroDocumento;
    proveedor.cCelular = this.cCelular;
    proveedor.cCorreo = this.f.email.value;
    proveedor.cPaginaWeb = this.cPaginaWeb;
    proveedor.cDireccion = this.cDireccion;
    proveedor.cActividadPrincipal = this.cActividadPrincipal;
    proveedor.cObservaciones = this.cObservaciones;
    proveedor.nEstado = this.cboEstadoItem.value;
    proveedor.cUsuarioModificacion = this.usuario_dni;
    proveedor.listContactos = this.listContactosEnvio;

    this._service.PutProveedor(this.proveedor_id, proveedor).subscribe((resp: any) => {
      console.log(resp);
      if (resp.success) {
        this.ObtenerProveedorPorId(this.proveedor_id);
        this.listContactosEnvio = [];

        this.toaster.open(NoticyAlertComponent, { text: `success-'Proveedor actualizado correctamente'` });
      } else {
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar el Proveedor.'` });
      }
    },
      (error: any) => {
        console.log(error);
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar el Proveedor.'` });
        return;
      }

    )

  }

  BotonEliminarProveedor(proveedor: ProveedorEntity) {

    var title = 'Eliminar Proveedor: ' + proveedor.cRazonSocial;
    var mensaje = '¿Está seguro que desea eliminar este proveedor?';


    //llamamos al servicio de confirmarEliminacion y le pasamos parámetros
    this.confirmService.confirmarEliminacion({ title: title, message: mensaje })
      .subscribe(result => {
        if (result) {
          /* Colocar aquí procedimiento al confirmar elimninación */

          this._service.RemoveProveedor(proveedor).subscribe(
            (resp: any) => {

              if (resp.success) {
                this.toaster.open(NoticyAlertComponent, { text: `info-El proveedor se actualizó exitosamente.` });
                proveedor.nEstado = 0;
                if (this.cboEstado.value == 1) {
                  this.filteredProveedores = this.filteredProveedores.filter(x => x != proveedor);
                }


              } else {
                this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar el Proveedor.'` });
              }
            },
            (error: any) => {
              console.error('Error al actualizar el Proveedor:', error);
              this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar el Proveedor.'` });

            }
          )
        }

      });

  }

  /* ************* CONTACTOS ************* */

  public BotonNuevoContacto() {
    const dialogRef = this._dialog.open(
      AddEditContactoComponent,
      {
        width: '750px',
        disableClose: true,
        data: {
          bEdit: false,
          cTitle: 'AGREGAR CONTACTO',
          cUsuarioDNI: this.usuario_dni
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {

      if (result) {

        this.listContactos.push(result);
        this.listContactosEnvio.push(result);
        this.cdr.detectChanges();
        console.log('PUSH');
      }
    });
  }

  public BotonEditarContacto(contacto: ProveedorContactoEntity) {
    const index = this.listContactos.findIndex(c => c === contacto);

    const dialogRef = this._dialog.open(
      AddEditContactoComponent,
      {
        width: '750px',
        disableClose: true,
        data: {
          bEdit: true,
          cTitle: 'EDITAR CONTACTO',
          cUsuarioDNI: this.usuario_dni,
          contacto: contacto
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {

      if (result) {
        this.listContactos[index] = result;

        if (contacto.id != 0) {
          this.listContactosEnvio.push(result);
        } else {
          const indexT = this.listContactosEnvio.findIndex(c => c === contacto);
          this.listContactosEnvio[indexT] = result;
        }
      }
      this.cdr.detectChanges();
    });
  }

  public BotonRemoverContacto(contacto: ProveedorContactoEntity) {
    var title = 'Eliminar Contacto: ' + contacto.cNombreCompleto;
    var mensaje = '¿Está seguro que desea eliminar este contacto?';


    //llamamos al servicio de confirmarEliminacion y le pasamos parámetros
    this.confirmService.confirmarEliminacion({ title: title, message: mensaje })
      .subscribe(result => {
        if (result) {
          console.log(contacto.id);
          /*  this.listContactos = this.listContactos.filter((item) => item != contacto); */
          contacto.nEstado = 0;
          if (contacto.id == 0) {
            this.listContactosEnvio = this.listContactosEnvio.filter((item) => item != contacto);
          } else {
            this.listContactosEnvio.push({ ...contacto, nEstado: 0 });
          }


        }

      });

    /*  if (contacto.id != 0) {
       this.listContactosEnvio.push({ ...contacto, nEstado: 0 });
     } else {
       this.listContactosEnvio = this.listContactos.filter((item) => item != contacto);
     } */
  }

  public BotonVisualizarProducto(producto) {
    const dialogRef = this._dialog.open(
      AddEditProductoComponent,
      {
        width: '850px',
        disableClose: true,
        data: {
          bEdit: true,
          cTitle: 'VISUALIZAR PRODUCTO',
          itemProducto: producto,
          bReadOnly: true
        },
      }
    );

  }

  buscarProveedores() {

    const proveedoresFiltrados = this.proveedores.filter(proveedor =>
      proveedor.cRazonSocial.toLowerCase().includes(this.search.toLowerCase()) ||
      proveedor.cActividadPrincipal.toLowerCase().includes(this.search.toLowerCase())
    );
    this.filteredProveedores = proveedoresFiltrados;
    this.desde = 0;
    this.hasta = this.pageSize;
  }

  cambiarPagina(e: PageEvent) {
    /*   console.log(e); */
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }


  public BotonVolver() {
    this.bNuevo = false;
    this.ResetForm();
    this.BotonListarProveedores();

  }


  public ResetForm() {
    //form
    this.nTipoPersona = 2;
    this.nTipoDocumento = 2;
    this.cNroDocumento = null;
    this.cRazonSocial = null;
    this.cCelular = null;
    this.f.email.setValue('');
    this.cPaginaWeb = null;
    this.cDireccion = null;
    this.cActividadPrincipal = null;
    this.cObservaciones = null;
    this.proveedor_id = 0;
    this.bEdit = false;
    this.cboEstadoItem.setValue(1);
    this.itemProveedor = null;

    this.listContactos = [];
    this.listProductos = [];
    this.listContactosEnvio = [];
  }


  DescargarExcel() {

    this._workbook = new Workbook();
    const sheet = this._workbook.addWorksheet('Reporte');

    //ancho de col
    sheet.getColumn("A").width = 17;
    sheet.getColumn("B").width = 7;
    sheet.getColumn("C").width = 19;
    sheet.getColumn("D").width = 11;
    sheet.getColumn("E").width = 15;
    sheet.getColumn("F").width = 18;
    sheet.getColumn("G").width = 15;

    sheet.columns.forEach((column) => {
      column.alignment = { vertical: 'middle', wrapText: true };
    });


    /* 1. ENCABEZADO PRINCIPAL */
    const title = 'FICHA DE PROVEEDOR';
    let titleRow = sheet.addRow([title]);
    sheet.mergeCells('A1:G1');

    titleRow.font = { name: 'Arial', family: 4, size: 10, bold: true, color: { argb: 'FFFFFF' } };
    titleRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '44546A' } };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    titleRow.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleRow.height = 20;

    sheet.addRow([]); // Agrega línea en blanco
    sheet.mergeCells('A2:G2');

    /* 2. DATOS GENERALES */


    // Definir los datos y celdas para pintar
    const celdasHeader = [
      { rango: 'A3', contenido: 'Razón social:' },
      { rango: 'A4', contenido: 'Correo:' },
      { rango: 'A5', contenido: 'Dirección:' },
      { rango: 'A6', contenido: 'Web:' },
      { rango: 'A7:A8', contenido: 'Actividad:' },
      { rango: 'A9:A10', contenido: 'Observaciones:' },
      { rango: 'F3', contenido: 'Documento:' },
      { rango: 'F4', contenido: 'Celular:' },
    ];

    // Agregar contenido a las celdas y aplicar estilos
    celdasHeader.forEach(({ rango, contenido }) => {
      const celdaActual = sheet.getCell(rango);
      celdaActual.value = contenido;

      // Establecer borde completo y color de fondo
      celdaActual.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };

      celdaActual.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '44546A' }
      };

      celdaActual.font = {
        name: 'Arial', family: 4, size: 10, color: { argb: 'FFFFFF' }
      };

      celdaActual.alignment = {
        vertical: 'middle', wrapText: true, indent: 1
      }


    });

    const celdasBody = [

      { rango: 'B3', contenido: this.itemProveedor.cRazonSocial },
      { rango: 'B4', contenido: this.itemProveedor.cCorreo },
      { rango: 'B5', contenido: this.itemProveedor.cDireccion },
      { rango: 'B6', contenido: this.itemProveedor.cPaginaWeb },
      { rango: 'B7', contenido: this.itemProveedor.cActividadPrincipal },
      { rango: 'B9', contenido: this.itemProveedor.cObservaciones },

      { rango: 'G3', contenido: this.itemProveedor.cNroDocumento },
      { rango: 'G4', contenido: this.itemProveedor.cCelular }
    ];

    // Agregar contenido a las celdas y aplicar estilos
    celdasBody.forEach(({ rango, contenido }) => {
      const celdaActual = sheet.getCell(rango);
      celdaActual.value = contenido;

      // Establecer borde completo y color de fondo
      celdaActual.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };

      celdaActual.alignment = {
        vertical: 'middle', wrapText: true, indent: 1
      };
    });

    sheet.mergeCells('A7:A8');
    sheet.mergeCells('A9:A10');

    sheet.mergeCells('B3:E3'); // -> Razón social:  //combinaciones 
    sheet.mergeCells('B4:E4'); // -> Correo:
    sheet.mergeCells('B5:G5'); // -> Dirección:
    sheet.mergeCells('B6:G6'); // -> Web:
    sheet.mergeCells('B7:G8'); // -> Actividad:
    sheet.mergeCells('B9:G10'); // -> Observaciones:

    sheet.mergeCells('A11:G11');



    /* 3. LISTA DE CONTACTOS */
    const titlecontacto = 'Contactos';
    let titlecontactoRow = sheet.addRow([titlecontacto]);
    sheet.mergeCells('A12:G12');

    titlecontactoRow.font = { name: 'Arial', family: 4, size: 10, /* bold: true, */ color: { argb: 'FFFFFF' } };
    titlecontactoRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '44546A' } };
    titlecontactoRow.alignment = { vertical: 'middle', horizontal: 'center' };
    titlecontactoRow.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    let header = [
      "Documento",
      "Nombres",
      "Nombres",
      "Nombres",
      "Correo",
      "Correo",
      "Celular"
    ]

    let headerRow = sheet.addRow(header);
    sheet.mergeCells('B13:D13');
    sheet.mergeCells('E13:F13');

    headerRow.eachCell((cell, number) => {

      cell.font = {
        bold: true,
        size: 10
      }
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    var dataExcel =
    {
      "cNroDocumento": 0,
      "cNombreCompleto": 1,
      "cNombreCompleto1": 2,
      "cNombreCompleto2": 3,
      "cCorreo": 4,
      "cCorreo1": 5,
      "cCelular": 6

    }

    var i = 0;
    var u = 13;

    for (let x1 of this.listContactosv2) {
      i = i + 1;

      let x2 = Object.keys(dataExcel); //Object.keys(x1);
      let temp = []

      for (let y of x2) {
        temp.push(x1[y])
      }

      let dataRow = sheet.addRow(temp);

      // Aplicar bordes a las celdas del listado
      dataRow.eachCell((cell, number) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });


      // Combina celdas dinámicamente
      let mergeStartCell = `B${i + 13}`;
      let mergeEndCell = `D${i + 13}`;
      sheet.mergeCells(mergeStartCell, mergeEndCell);

      let mergeStartCell2 = `E${i + 13}`;
      let mergeEndCell2 = `F${i + 13}`;
      sheet.mergeCells(mergeStartCell2, mergeEndCell2);

      u = u + 1;
    }

    /* 3. LISTA DE PRODUCTOS */
    sheet.mergeCells(`A${u + 1}`, `G${u + 1}`);
    const titleproducto = 'Gama de Productos';
    let titleproductoRow = sheet.addRow([titleproducto]);
    sheet.mergeCells(`A${u + 2}`, `G${u + 2}`);
    titleproductoRow.font = { name: 'Arial', family: 4, size: 10, /* bold: true, */ color: { argb: 'FFFFFF' } };
    titleproductoRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '44546A' } };
    titleproductoRow.alignment = { vertical: 'middle', horizontal: 'center' };
    titleproductoRow.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    var n = u + 3;

    let headerProduct = [
      "SKU",
      "Nombre",
      "Nombre",
      "Categoría",
      "Categoría",
      "Fecha de compra",
      "Compra (PEN)"
    ]

    let headerProductRow = sheet.addRow(headerProduct);


    sheet.mergeCells(`B${n}`, `C${n}`);
    sheet.mergeCells(`D${n}`, `E${n}`);

    headerProductRow.eachCell((cell, number) => {

      cell.font = {
        bold: true,
        size: 10
      }
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    var dataProductExcel =
    {
      "cSku": 0,
      "cDescripcion": 1,
      "cDescripcion1": 2,
      "cNombreCategoria": 3,
      "cNombreCategoria2": 4,
      "dFechaCompra": 5,
      "nPrecioPEN": 6



    }

    var j = 0;

    for (let x1 of this.listProductos) {
      j = j + 1;

      let x2 = Object.keys(dataProductExcel); //Object.keys(x1);
      let temp = []

      for (let y of x2) {
        temp.push(x1[y])
      }

      let dataRow = sheet.addRow(temp);

      // Aplicar bordes a las celdas del listado
      dataRow.eachCell((cell, number) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
      // Combina celdas dinámicamente
      let mergeStartCell = `B${j + n}`;
      let mergeEndCell = `C${j + n}`;
      sheet.mergeCells(mergeStartCell, mergeEndCell);

      let mergeStartCell2 = `D${j + n}`;
      let mergeEndCell2 = `E${j + n}`;
      sheet.mergeCells(mergeStartCell2, mergeEndCell2);



    }

    this._workbook.creator = this.vendedor_nombre;

    const nombreArchivo = 'ccv(ficha_proveedor)' + this.itemProveedor.cRazonSocial.replace(/\s/g, '') + '.xlsx';


    this._workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data]);
      fs.saveAs(blob, nombreArchivo);
    })

  }



}
