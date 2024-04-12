import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { ProductsService } from '../../e-commerce/_services';
import { ConfirmService } from 'src/app/shared/confirm/confirm.service';
import { Toaster } from 'ngx-toast-notifications';
import { ServiciosGeneralService } from '../../servicios-general.service';
import { FormControl } from '@angular/forms';
import { AddEditProductoComponent } from '../add-edit-producto/add-edit-producto.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-listado-productos',
  templateUrl: './listado-productos.component.html',
  styleUrls: ['./listado-productos.component.scss']
})
export class ListadoProductosComponent implements OnInit {


  isLoading$: any = null;

  search: any = null;
  filteredProductos: any = [];

  //nuevo

  productos: any = [];
  //filtro
  cboEstado: FormControl = new FormControl(-1);

  //listas
  lstEstados = [
    { nIdEstado: -1, cEstado: 'Todos' },
    { nIdEstado: 2, cEstado: 'Publicado' },
    { nIdEstado: 1, cEstado: 'Borrador' },
    { nIdEstado: 0, cEstado: 'Inactivo' },
  ];


  //paginacion
  pageSize = 5;
  desde: number = 0;
  hasta: number = 5;

  constructor(
    public _service: ServiciosGeneralService,
    public confirmService: ConfirmService,
    public toaster: Toaster,
    private _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._service.isLoadingSubject;
    this.BotonListarProductos();
  }

  public BotonListarProductos() {
    this.search = null;
    this._service.GetProductos(this.cboEstado.value).subscribe((resp: any) => {
      console.log('PRODUCTOS. ', resp);
      this.productos = resp.productos.data;
      this.filteredProductos = [...this.productos];
    })
  }

  public BotonNuevoProducto() {
    const dialogRef = this._dialog.open(
      AddEditProductoComponent,
      {
        width: '850px',
        disableClose: true,
        data: {
          bEdit: false,
          cTitle: 'Crear Categoría',
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {

      /*   this.BotonListarCategorias(); */
    });
  }


  buscarProductos() {

    const productosFiltrados = this.productos.filter(p =>
      p.cDescripcion.toLowerCase().includes(this.search.toLowerCase())
    );


    this.filteredProductos = productosFiltrados;
    this.desde = 0;  // Reinicia la paginación a la primera página
    this.hasta = this.pageSize;
  }

  cambiarPagina(e: PageEvent) {
    /*   console.log(e); */
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }


}
