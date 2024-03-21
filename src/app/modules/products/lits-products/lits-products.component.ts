import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../_services/products.service';
import { ConfirmService } from 'src/app/shared/confirm/confirm.service';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-lits-products',
  templateUrl: './lits-products.component.html',
  styleUrls: ['./lits-products.component.scss']
})
export class LitsProductsComponent implements OnInit {

  products: any = [];
  isLoading$: any = null;

  search: any = null;
  filteredProductos: any = [];

  state: any = 0;

  //paginacion
  pageSize = 5;
  desde: number = 0;
  hasta: number = 5;

  constructor(
    public _productServices: ProductsService,
    public confirmService: ConfirmService,
    public toaster: Toaster,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._productServices.isLoadingSubject;
    this.allProducts();
  }

  allProducts(page = 1) {

    this.filteredProductos = [];
    let LINK = "";

    this._productServices.allProducts(1, this.state, this.search).subscribe((resp: any) => {
      console.log(resp);
      this.products = resp.products.data;
      this.filteredProductos = [...this.products];
    })
  }

  reset() {
    this.search = null;
    this.allProducts();
  }
  edit(product) {

  }

  delete(product) {
    console.log(product);
    var title = 'Remover Producto: ' + product.title;
    var mensaje = '¿Está seguro que desea remover este producto?';


    //llamamos al servicio de confirmarEliminacion y le pasamos parámetros
    this.confirmService.confirmarEliminacion({ title: title, message: mensaje })
      .subscribe(result => {
        if (result) {
          /* Colocar aquí procedimiento al confirmar elimninación */

          this._productServices.removeProducto(product).subscribe(
            (resp: any) => {
              console.log(resp);
              if (resp.success) {
                this.toaster.open(NoticyAlertComponent, { text: `info-El producto se removió exitosamente.` });

                if (this.state != '0') {
                  this.filteredProductos = this.filteredProductos.filter((item) => item != product);
                } else {
                  product.state = resp.state;
                }

                /*  console.log('resp: ', resp); */
                return;
              }
            },
            (error: any) => {
              /*    console.error('Error al actualizar la categoría:', error); */
              this.toaster.open(NoticyAlertComponent, { text: `danger-Ocurrió un error al remover el producto.` });
              this.reset();
              return;
            }
          )
        }

      });
  }

  buscarProductos() {

    const productosFiltrados = this.products.filter(p =>
      p.title.toLowerCase().includes(this.search.toLowerCase())
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
