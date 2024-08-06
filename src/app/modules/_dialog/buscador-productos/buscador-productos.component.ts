import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { URL_BACKEND } from 'src/app/config/config';
import { ServiciosGeneralService } from '../../servicios-general.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-buscador-productos',
  templateUrl: './buscador-productos.component.html',
  styleUrls: ['./buscador-productos.component.scss']
})
export class BuscadorProductosComponent implements OnInit {

  URL_BACKEND: any = URL_BACKEND;
  isLoading$: any = null;

  cboCategoria: FormControl = new FormControl(0);
  categorias: any;

  search: any = null;

  filteredProductos: any = [];
  productos: any = [];

  //paginacion
  pageSize = 5;
  desde: number = 0;
  hasta: number = 5;

  constructor(
    public _service: ServiciosGeneralService,
    public dialogRef: MatDialogRef<BuscadorProductosComponent>,) { }

  ngOnInit(): void {
    this.isLoading$ = this._service.isLoadingSubject;
    this.BotonListarProductos();
    this.ListarCategorias();
  }

  public BotonListarProductos() {
    this.search = null;
    this._service.GetProductos(
      2, //Estado: Publicado
      this.cboCategoria.value,
      -1, //stock
      null, //fechas
      null,//fechas


    ).subscribe((resp: any) => {
      console.log('PRODUCTOS. ', resp);
      /*  this.productos = resp.productos.data; */
      this.productos = resp.productos;
      this.filteredProductos = [...this.productos];
    })
  }

  public ListarCategorias() {
    this._service.GetCategorias(1).subscribe((resp: any) => {
      this.categorias = resp.categorias;
    })
  }


  InputBuscarProductos() {

    const productosFiltrados = this.productos.filter(p =>
      p.cDescripcion.toLowerCase().includes(this.search.toLowerCase())
    );


    this.filteredProductos = productosFiltrados;
    this.desde = 0;  // Reinicia la paginación a la primera página
    this.hasta = this.pageSize;
  }

  public BotonLimpiarFiltros() {
    this.search = null;
    this.cboCategoria.setValue(0);
  }

  BotonSeleccionarProducto(producto) {
    this.dialogRef.close(producto); //Devolver cliente al cerrar el modal;
  }

  cambiarPagina(e: PageEvent) {
    console.log(e);
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }

}
