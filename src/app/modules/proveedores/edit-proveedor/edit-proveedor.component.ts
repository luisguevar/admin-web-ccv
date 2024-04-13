import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { ProveedorService } from '../_service/proveedor.service';
import { error } from 'console';
import { ActivatedRoute } from '@angular/router';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-edit-proveedor',
  templateUrl: './edit-proveedor.component.html',
  styleUrls: ['./edit-proveedor.component.scss']
})
export class EditProveedorComponent implements OnInit {


  isLoading$: any;
  productos: any = [];
  vendedor_nombre: string = null;
  lstReporte: string[];

  constructor(
    public toaster: Toaster,
    public _proveedorService: ProveedorService,
    public modelService: NgbModal,
    public activerouter: ActivatedRoute,
    public authservice: AuthService,
  ) { }

  private _workbook: Workbook
  proveedor_id: any = 0;
  proveedor: any = null;
  contactos: any = [];

  listContactoNew: any = [];

  /* Data Proveedor */
  title: any = null;
  tipoPersona: any = 1;
  tipoDocumento: any = 1;
  nroDocumento: any = null;
  razonSocial: any = null;
  celular: any = null;
  correo: any = null;
  web: any = null;
  direccion: any = null;
  observaciones: any = null;
  actividad: any = null;
  listContacto: any = [];


  /* Data Contacto */
  nombreContacto: any = null;
  correoContacto: any = null;
  tipoDocumentoContacto: any = 1;
  nroDocumentoContacto: any = null;
  celularContacto: any = null;

  isButtonClicked: boolean = false;

  ngOnInit(): void {
    this.isLoading$ = this._proveedorService.isLoadingSubject;
    this.vendedor_nombre = this.authservice.user.name + ' ' + this.authservice.user.surname + ' / ' + this.authservice.user.email;
    this.activerouter.params.subscribe((resp: any) => {
      this.proveedor_id = resp["id"] || "";
    })

    this.showProveedor(this.proveedor_id);


  }

  showProveedor(id: any) {
    this._proveedorService.showProveedor(id).subscribe((resp: any) => {
      console.log('proveedor: ', resp);

      this.proveedor = resp.proveedor;
      this.contactos = resp.contactos;
     /*  this.productos = resp.productos.data; */

      this.title = this.proveedor.razon_social;

      this.tipoPersona = this.proveedor.tipoPersona;
      this.tipoDocumento = this.proveedor.tipoDocumento;
      this.nroDocumento = this.proveedor.nroDocumento;
      this.razonSocial = this.proveedor.razon_social;
      this.celular = this.proveedor.celular;
      this.correo = this.proveedor.correo;
      this.web = this.proveedor.web;
      this.direccion = this.proveedor.direccion;
      this.observaciones = this.proveedor.observaciones;
      this.actividad = this.proveedor.actividad;

      this.listContacto = this.contactos;

    })
  }


  addContacto() {

    /* Validar campos llenos */
    if (!this.nombreContacto ||
      !this.correoContacto ||
      !this.tipoDocumentoContacto ||
      !this.celularContacto) {

      this.toaster.open(NoticyAlertComponent, { text: `warning-Todos los campos del contacto son obligatorios` });
      return;
    }


    /* Insertar campos a la lista */
    let dataContacto = {
      id: 0,
      estado: 1,
      nombre: this.nombreContacto,
      correo: this.correoContacto,
      tipoDocumento: this.tipoDocumentoContacto,
      nroDocumento: this.nroDocumentoContacto,
      celular: this.celularContacto,

    }

    this.listContacto.push(dataContacto);
    this.listContactoNew.push(dataContacto);

    /* Resetear campos */

    this.nombreContacto = null;
    this.correoContacto = null;
    this.nroDocumentoContacto = null;
    this.celularContacto = null;


  }

  removeContacto(contacto: any) {

    if (contacto.id !== 0) {
      const contactoInactivo = { ...contacto, estado: 0 };
      this.listContactoNew.push(contactoInactivo);
    } else {
      this.listContactoNew = this.listContactoNew.filter((item) => item != contacto);
    }

    const dataIndex = this.listContacto.findIndex(item => item === contacto);

    if (dataIndex !== -1) {
      this.listContacto.splice(dataIndex, 1);
    }


  }


  updateProveedor() {

    if (!this.razonSocial) {
      this.isButtonClicked = true;

      this.toaster.open(NoticyAlertComponent, { text: `warning-Ingrese el campo 'razon social' para continuar` });

      return;
    }

    if (!this.nroDocumento) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-Ingrese el campo 'Nro Documento' para continuar` });
    }

    if (!this.celular) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-Ingrese el campo 'Celular' para continuar` });
    }



    let dataProveedor = {
      id: this.proveedor_id,
      estado: 1,
      tipoPersona: this.tipoPersona,
      tipoDocumento: this.tipoDocumento,
      nroDocumento: this.nroDocumento,
      razon_social: this.razonSocial,
      celular: this.celular,
      correo: this.correo,
      web: this.web,
      direccion: this.direccion,
      observaciones: this.observaciones,
      actividad: this.actividad,
      listContacto: this.listContactoNew

    }

    console.log('dataProveedor', dataProveedor);


    this.update(dataProveedor);
  }


  update(dataProveedor: any) {

    this._proveedorService.updateProveedor(dataProveedor).subscribe(
      (resp: any) => {
        console.log('Respuesta:', resp);

        if (resp.success) {
          /* this.resetForm(); */
          this.listContactoNew = [];
          this.showProveedor(this.proveedor_id);
          this.toaster.open(NoticyAlertComponent, { text: `success-El proveedor se actualizó exitosamente.` });
        }
      },
      (error: any) => {
        console.error('Error al actualizar el proveedor:', error);
        this.toaster.open(NoticyAlertComponent, { text: `danger-Ocurrió un error al actualizar el proveedor.` });
        return;
      }
    )


  }

  descargar() {

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

      { rango: 'B3', contenido: this.proveedor.razon_social },
      { rango: 'B4', contenido: this.proveedor.correo },
      { rango: 'B5', contenido: this.proveedor.direccion },
      { rango: 'B6', contenido: this.proveedor.web },
      { rango: 'B7', contenido: '' },
      { rango: 'B9', contenido: this.proveedor.observaciones },

      { rango: 'G3', contenido: this.proveedor.nroDocumento },
      { rango: 'G4', contenido: this.proveedor.celular }
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

    for (let x1 of this.contactos) {
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

    for (let x1 of this.productos) {
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

    const nombreArchivo = 'ccv(ficha_proveedor)' + this.proveedor.razon_social.replace(/\s/g, '') + '.xlsx';


    this._workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data]);
      fs.saveAs(blob, nombreArchivo);
    })

  }



}
