import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Toaster } from 'ngx-toast-notifications';
import { AuthService } from '../../auth';
import { ServiciosGeneralService } from '../../servicios-general.service';
import { PageEvent } from '@angular/material/paginator';
import { ProveedorEntity } from 'src/app/Models/ProveedorEntity';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { ConfirmService } from 'src/app/shared/confirm/confirm.service';

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
  cCorreo: string = null;
  cPaginaWeb: string = null;
  cDireccion: string = null;
  cActividadPrincipal: string = null;
  cObservaciones: string = null;
  usuario_dni: string = "";

  //
  itemProveedor: ProveedorEntity;
  proveedor_id: number = 0;
  bEdit: boolean = false;
  listaContactos: any;
  listaProductos: any;

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
  ) {

    this.isLoading$ = this._service.isLoading$;
    this.BotonListarProveedores();
    this.vendedor_nombre = this.authservice.user.name + ' ' + this.authservice.user.surname + ' / ' + this.authservice.user.email;
    this.usuario_dni = this.authservice.user.cDocumento;
  }

  ngOnInit(): void {
  }

  public BotonListarProveedores() {
    this.search = '';
    this._service.GetProveedores(this.cboEstado.value).subscribe((resp: any) => {
      console.log('PROVEEDORES. ', resp);
      this.proveedores = resp.proveedores;
      this.filteredProveedores = [...this.proveedores];
    })
  }

  public BotonNuevoProveedor() {
    this.bNuevo = true;
    this.cTitle = "REGISTRAR PROVEEDOR";
  }

  public BotonEditarProveedor(element: ProveedorEntity) {
    this.bNuevo = true;
    this.cTitle = "EDITAR PROVEEDOR";
    this.bEdit = true;
    this.ObtenerProveedorPorId(element.id);
  }

  public ObtenerProveedorPorId(id: number) {
    this._service.GetProveedorPorId(id).subscribe((resp: any) => {
      console.log('proveedor: ', resp);
      this.itemProveedor = resp.proveedor;
      this.proveedor_id = resp.proveedor.id;
      this.nTipoPersona = resp.proveedor.nTipoPersona;
      this.nTipoDocumento = resp.proveedor.nTipoDocumento;
      this.cNroDocumento = resp.proveedor.cNroDocumento;
      this.cRazonSocial = resp.proveedor.cRazonSocial;
      this.cCelular = resp.proveedor.cCelular;
      this.cCorreo = resp.proveedor.cCorreo;
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
      this.DescargarExcel();
      /*  this.listaContactos = resp.contactos;
       this.listaProductos = resp.productos.data; */
    })


  }



  public BotonGuardarProveedor() {

    const proveedor = new ProveedorEntity();
    proveedor.id = 0;
    proveedor.cRazonSocial = this.cRazonSocial;
    proveedor.nTipoPersona = this.nTipoPersona;
    proveedor.nTipoDocumento = this.nTipoPersona;
    proveedor.cNroDocumento = this.cNroDocumento;
    proveedor.cCelular = this.cCelular;
    proveedor.cCorreo = this.cCorreo;
    proveedor.cPaginaWeb = this.cPaginaWeb;
    proveedor.cDireccion = this.cDireccion;
    proveedor.cActividadPrincipal = this.cActividadPrincipal;
    proveedor.cObservaciones = this.cObservaciones;
    proveedor.nEstado = this.cboEstadoItem.value;
    proveedor.cUsuarioCreacion = this.usuario_dni;
    proveedor.cUsuarioModificacion = this.usuario_dni;

    this._service.PostProveedor(proveedor).subscribe((resp: any) => {

      console.log(resp);
      if (resp.success) {
        this.toaster.open(NoticyAlertComponent, { text: `primary-El Proveedor se registró exitosamente.` });

        this.proveedor_id = resp.proveedor.id;
        this.bEdit = true;

      } else {
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al registrar el Proveedor.'` });
      }
    },
      (error: any) => {
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al registrar el Proveedor.'` });
        return;
      }
    )
  }


  public BotonActualizarProveedor() {
    const proveedor = new ProveedorEntity();
    proveedor.id = this.proveedor_id;
    proveedor.cRazonSocial = this.cRazonSocial;
    proveedor.nTipoPersona = this.nTipoPersona;
    proveedor.nTipoDocumento = this.nTipoPersona;
    proveedor.cNroDocumento = this.cNroDocumento;
    proveedor.cCelular = this.cCelular;
    proveedor.cCorreo = this.cCorreo;
    proveedor.cPaginaWeb = this.cPaginaWeb;
    proveedor.cDireccion = this.cDireccion;
    proveedor.cActividadPrincipal = this.cActividadPrincipal;
    proveedor.cObservaciones = this.cObservaciones;
    proveedor.nEstado = this.cboEstadoItem.value;
    proveedor.cUsuarioModificacion = this.usuario_dni;

    this._service.PutProveedor(this.proveedor_id, proveedor).subscribe((resp: any) => {
      console.log(resp);
      if (resp.success) {
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

    var title = 'Remover Proveedor: ' + proveedor.cRazonSocial;
    var mensaje = '¿Está seguro que desea remover este proveedor?';

    //llamamos al servicio de confirmarEliminacion y le pasamos parámetros
    this.confirmService.confirmarEliminacion({ title: title, message: mensaje })
      .subscribe(result => {
        if (result) {
          /* Colocar aquí procedimiento al confirmar elimninación */

          this._service.RemoveProveedor(proveedor).subscribe(
            (resp: any) => {

              if (resp.success) {
                this.toaster.open(NoticyAlertComponent, { text: `info-El Proveedor se removió exitosamente.` });
                proveedor.nEstado = 0;


              } else {
                this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al remover El Proveedor.'` });
              }
            },
            (error: any) => {
              console.error('Error al actualizar el Proveedor:', error);
              this.toaster.open(NoticyAlertComponent, { text: `danger-Ocurrió un error al remover El Proveedor.` });

            }
          )
        }

      });

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
    this.BotonListarProveedores();
    this.ResetForm();
  }


  public ResetForm() {
    //form
    this.nTipoPersona = 2;
    this.nTipoDocumento = 2;
    this.cNroDocumento = null;
    this.cRazonSocial = null;
    this.cCelular = null;
    this.cCorreo = null;
    this.cPaginaWeb = null;
    this.cDireccion = null;
    this.cActividadPrincipal = null;
    this.cObservaciones = null;
    this.proveedor_id = 0;
    this.bEdit = false;
    this.cboEstadoItem.setValue(1);
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
      "nroDocumento": 0,
      "nombre": 1,
      "nombre1": 2,
      "nombre2": 3,
      "correo": 4,
      "correo1": 5,
      "celular": 6

    }

    var i = 0;
    var u = 13;

    /* for (let x1 of this.contactos) {
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
    } */

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
      "Precio de Compra"
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
      "sku": 0,
      "title": 1,
      "title1": 2,
      "categorie_name": 3,
      "categorie_name2": 4,
      "fecha_compra": 5,
      "price_soles": 6



    }

    var j = 0;

    /* for (let x1 of this.productos) {
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



    } */

    this._workbook.creator = this.vendedor_nombre;

    const nombreArchivo = 'ccv(ficha_proveedor)' + this.itemProveedor.cRazonSocial.replace(/\s/g, '') + '.xlsx';


    this._workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data]);
      fs.saveAs(blob, nombreArchivo);
    })

  }

}
