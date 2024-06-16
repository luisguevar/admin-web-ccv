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
import { URL_BACKEND } from 'src/app/config/config';

@Component({
  selector: 'app-listado-productos',
  templateUrl: './listado-productos.component.html',
  styleUrls: ['./listado-productos.component.scss']
})
export class ListadoProductosComponent implements OnInit {

  URL_BACKEND: any = URL_BACKEND;
  isLoading$: any = null;

  search: any = null;
  filteredProductos: any = [];

  //nuevo

  productos: any = [];
  //filtro
  cboEstado: FormControl = new FormControl(-1);
  cboCategoria: FormControl = new FormControl(0);
  cboTipoStock: FormControl = new FormControl(-1);
  startDate: FormControl = new FormControl(null);
  endDate: FormControl = new FormControl(null);

  //listas
  lstEstados = [
    { nIdEstado: -1, cEstado: 'Todos' },
    { nIdEstado: 2, cEstado: 'Publicado' },
    { nIdEstado: 1, cEstado: 'Borrador' },
    { nIdEstado: 0, cEstado: 'Inactivo' },
  ];

  lstTipoStock = [
    { id: -1, cDescripcion: 'Todos los tipos de stocks' },
    { id: 1, cDescripcion: 'Con Stock' },
    { id: 0, cDescripcion: 'Sin Stock' },
  ];



  //paginacion
  pageSize = 5;
  desde: number = 0;
  hasta: number = 5;
  categorias: any;

  constructor(
    public _service: ServiciosGeneralService,
    public confirmService: ConfirmService,
    public toaster: Toaster,
    private _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._service.isLoadingSubject;
    this.BotonListarProductos();
    this.ListarCategorias();
  }

  public BotonListarProductos() {
    this.search = null;
    this._service.GetProductos(this.cboEstado.value,
      this.cboCategoria.value,
      this.cboTipoStock.value,
      this.startDate.value,
      this.endDate.value


    ).subscribe((resp: any) => {
      console.log('PRODUCTOS. ', resp);
      /*  this.productos = resp.productos.data; */
      this.productos = resp.productos;
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
          cTitle: 'REGISTRAR PRODUCTO',
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {

      this.BotonListarProductos();
    });
  }

  public BotonEditarProducto(producto) {
    const dialogRef = this._dialog.open(
      AddEditProductoComponent,
      {
        width: '850px',
        disableClose: true,
        data: {
          bEdit: true,
          cTitle: 'EDITAR PRODUCTO',
          itemProducto: producto
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {

      this.BotonListarProductos();
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

  public ListarCategorias() {
    this._service.GetCategorias(1).subscribe((resp: any) => {
      this.categorias = resp.categorias;
    })
  }

  public BotonLimpiarFiltros() {
    this.search = null;

    this.cboEstado.setValue(-1);
    this.cboCategoria.setValue(0);
    this.cboTipoStock.setValue(-1);
    this.startDate.setValue(null);
    this.endDate.setValue(null);
    this.BotonListarProductos();
  }


}
