import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { CotizacionService } from '../_service/cotizacion.service';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  constructor(
    public toaster: Toaster,
    public _CotizacionService: CotizacionService,
    public modelService: NgbModal,
  ) { }

  search : any = null;
  filteredProductos : any =[];
  productos : any = null;
  mensaje : any = "Ingrese el nombre de un Producto";

  ngOnInit(): void {
    this.allProductos();
  }

  listProductosall:any = null;

  allProductos() {
    this._CotizacionService.allProductos().subscribe((resp: any) => {
      //console.log('Productos: ', resp);
      this.listProductosall = resp.productos;
      
    })
  }

  buscarProductos() {
    // Filtra la lista completa de clientes según el término de búsqueda
    const productosFiltrados = this.listProductosall.filter(producto =>
      producto.title.toLowerCase().includes(this.search.toLowerCase())
    );
    // Asigna la lista filtrada a filteredClientes y luego aplica la paginación
    this.filteredProductos =  productosFiltrados;
   
    this.mensaje = "No se Encontraron Productos";
   console.log(this.filteredProductos);
  }

  reset() {
    this.allProductos();
    this.search = null;
  }

}
