import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { CotizacionService } from '../../cotizaciones/_service/cotizacion.service';

@Component({
  selector: 'app-add-producto-dialog',
  templateUrl: './add-producto-dialog.component.html',
  styleUrls: ['./add-producto-dialog.component.scss']
})
export class AddProductoDialogComponent implements OnInit {

  constructor(
    public toaster: Toaster,
    public _CotizacionService: CotizacionService,
    public modelService: NgbModal,
    public modal: NgbActiveModal,
  ) { }
  //paginacion
  pageSize = 3;
  desde: number = 0;
  hasta: number = 3;


  search: any = null;
  filteredProductos: any = [];
  productos: any = null;
  mensaje: any = "Ingrese el nombre de un Producto";


  //Producto Seleccionado
  selectedProducto: any = null;
  @Output() productoE: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    this.allProducts();
  }

  listProductosall: any = [];


  allProducts(page = 1) {
    let LINK = "";
    if (this.search) {
      LINK = LINK + "&search=" + this.search;
    }
    /* this._productServices.allProducts(page, LINK).subscribe((resp: any) => {
      console.log(resp);
      this.listProductosall = resp.products.data.filter(x => (x.state != 3));
    }) */
  }

  buscarProductos() {
    // Filtra la lista completa de clientes según el término de búsqueda

    const productosFiltrados = this.listProductosall.filter(producto =>
      producto.title.toLowerCase().includes(this.search.toLowerCase())
    );
    // Asigna la lista filtrada a filteredClientes y luego aplica la paginación
    this.filteredProductos = productosFiltrados;

    this.mensaje = "No se Encontraron Productos";
    console.log(this.filteredProductos);
    if (!this.search) {
      this.filteredProductos = [];
    }
    this.desde = 0;  // Reinicia la paginación a la primera página
    this.hasta = this.pageSize;

  }

  reset() {
    this.allProducts();
    this.search = null;
  }

  cambiarPagina(e: PageEvent) {
    console.log(e);
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }

  seleccionarProducto(product) {
    this.modal.close();
    this.selectedProducto = product;
    this.productoE.emit(this.selectedProducto);
    return;
  }

}
