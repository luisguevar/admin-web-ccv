import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProveedorService } from '../_service/proveedor.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { URL_BACKEND } from 'src/app/config/config';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { PageEvent } from '@angular/material/paginator';
import { DeleteProveedorComponent } from '../delete-proveedor/delete-proveedor.component';
import { Workbook } from 'exceljs';
import { AuthService } from '../../auth';
import * as fs from 'file-saver';
import { ConfirmService } from 'src/app/shared/confirm/confirm.service';

@Component({
  selector: 'app-list-proveedor',
  templateUrl: './list-proveedor.component.html',
  styleUrls: ['./list-proveedor.component.scss']
})
export class ListProveedorComponent implements OnInit {
  isLoading$;
  search: any = null;

  proveedores: any = [];
  URL_BACKEND: any = URL_BACKEND;

  filteredProveedores: any = [];
  
  //paginacion
  pageSize = 5;
  desde: number = 0;
  hasta: number = 5;

  vendedor_nombre: string = null;

  constructor(
    public _proveedorService: ProveedorService,
    public modelService: NgbModal,
    public toaster: Toaster,
    private cdr: ChangeDetectorRef,
    public authservice: AuthService,
    public confirmService: ConfirmService
  ) { }

  ngOnInit(): void {
    /*   this.spinnerService.startSpinner(); */
    this.isLoading$ = this._proveedorService.isLoading$;
    this.allProveedores();
    this.vendedor_nombre = this.authservice.user.name + ' ' + this.authservice.user.surname + ' / ' + this.authservice.user.email;
  }

  allProveedores() {

    this._proveedorService.allProveedores(1, this.search).subscribe((resp: any) => {
     /*  console.log('Proveedores: ', resp); */
      this.proveedores = resp.proveedores;
      this.filteredProveedores = [...this.proveedores];
    })
  }

  buscarProveedores() {
    // Filtra la lista completa de clientes según el término de búsqueda
    const proveedoresFiltrados = this.proveedores.filter(proveedor =>
      proveedor.razon_social.toLowerCase().includes(this.search.toLowerCase())
    );



    // Asigna la lista filtrada a filteredClientes y luego aplica la paginación
    this.filteredProveedores = proveedoresFiltrados;
    this.desde = 0;  // Reinicia la paginación a la primera página
    this.hasta = this.pageSize;
  }

  cambiarPagina(e: PageEvent) {
    /*   console.log(e); */
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }


  reset() {
    this.search = null;
    this.proveedores = [];
    this.filteredProveedores = [];
    this.allProveedores();
  }

  /*  probarAlerta() {
     this.toaster.open(NoticyAlertComponent, { text: `primary-La cotización se registró exitosamente.` });
 
   } */

  delete(proveedor) {

    var title = 'Eliminar Proveedor';
    var mensaje = '¿Está seguro que desea eliminar este proveedor?';

    this.confirmService.confirmarEliminacion({ title: title, message: mensaje })
      .subscribe(result => {
        if (result) {
          /* Colocar aquí procedimiento al confirmar elimninación */
          
          this._proveedorService.removeProveedor(proveedor).subscribe(
            (resp: any) => {

              if (resp.success) {
                this.toaster.open(NoticyAlertComponent, { text: `info-El proveedor se removió exitosamente.` });
                this.filteredProveedores = this.filteredProveedores.filter((item) => item != proveedor)
                return;
              }
            },
            (error: any) => {
              console.error('Error al actualizar el proveedor:', error);
              this.toaster.open(NoticyAlertComponent, { text: `danger-Ocurrió un error al eliminar el proveedor.` });
              this.reset();
              return;
            }
          )
        }

      });

  }

  private _workbook: Workbook
  proveedor: any = null;
  contactos: any = [];
  productos: any = [];

  descargarFicha(proveedor) {
    this.toaster.open(NoticyAlertComponent, { text: `success-Descargando Ficha de Proveedor.` });

    this._proveedorService.showProveedor(proveedor.id).subscribe((resp: any) => {
      console.log('proveedor: ', resp);

      this.proveedor = resp.proveedor;
      this.contactos = resp.contactos;
      this.productos = resp.productos.data;
      this.descargar();

    })
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
