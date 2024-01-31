import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-punto-venta',
  templateUrl: './create-punto-venta.component.html',
  styleUrls: ['./create-punto-venta.component.scss']
})
export class CreatePuntoVentaComponent implements OnInit {

  cliente_nombre: any = null;
  vendedor_nombre: any = null;

  //PRODUCTOS
  producto_nombre: any = null;
  cantidad: any = null;


  constructor() { }

  ngOnInit(): void {
  }

  addCliente() {

  }

  addProductoDialog(){

  }

  addProducto(){
    
  }
}
