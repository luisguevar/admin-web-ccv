import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

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
  cboTipoDocumento: any = 1;

  cboTipoPago = new FormControl('1');
  bPagoEfectivo: boolean = true;
  bPagoTarjeta: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.cboTipoPago.valueChanges.subscribe(value => {


      if (value === '1') {
        this.bPagoEfectivo = true;
        this.bPagoTarjeta = false;
      } else {
        this.bPagoTarjeta = true;
        this.bPagoEfectivo = false;
      }

      console.log('bPagoEfectivo: ', this.bPagoEfectivo);
      console.log('bPagoTarjeta: ', this.bPagoTarjeta);
    });

  }

  addCliente() {

  }

  addProductoDialog() {

  }

  addProducto() {

  }
}
