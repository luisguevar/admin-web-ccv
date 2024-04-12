import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiciosGeneralService } from '../../servicios-general.service';
import { Toaster } from 'ngx-toast-notifications';
import { AuthService } from '../../auth';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-edit-producto',
  templateUrl: './add-edit-producto.component.html',
  styleUrls: ['./add-edit-producto.component.scss']
})
export class AddEditProductoComponent implements OnInit {

  isLoading$;
  isLoading: boolean = false;

  bEdit: boolean = false;

  categorias: any = [];

  //GENERAL
  cDescripcion: string = null;
  cboEstado: FormControl = new FormControl(1);
  categoria_id: number = 0;
  cSku: string = '';
  nPrecioPEN: number = null;
  nPrecioUSD: number = null;
  nStock: number = null;

  //DETALLES
  cResumen: string= null;
  cDescripcionDetallada: string = null;

  //listas
  lstEstados = [

    { nIdEstado: 2, cEstado: 'Publicado' },
    { nIdEstado: 1, cEstado: 'Borrador' },
    { nIdEstado: 0, cEstado: 'Inactivo' },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddEditProductoComponent>,
    public _service: ServiciosGeneralService,
    public toaster: Toaster,
    public authservice: AuthService

  ) {

    this.ListarCategorias();
  }

  ngOnInit(): void {
    this.isLoading$ = this._service.isLoading$;
  }

  BotonGuardarProducto() {

  }

  BotonActualizarProducto() {

  }

  public ListarCategorias() {
    this._service.GetCategorias(1).subscribe((resp: any) => {
      this.categorias = resp.categorias;
    })
  }



}
