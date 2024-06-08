import { Component, Inject, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmService } from 'src/app/shared/confirm/confirm.service';
import { Toaster } from 'ngx-toast-notifications';
import { URL_BACKEND } from 'src/app/config/config';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { PageEvent } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AddEditCategoriaComponent } from '../add-edit-categoria/add-edit-categoria.component';
import { FormControl } from '@angular/forms';
import { ServiciosGeneralService } from '../../servicios-general.service';

@Component({
  selector: 'app-listado-categorias',
  templateUrl: './listado-categorias.component.html',
  styleUrls: ['./listado-categorias.component.scss']
})
export class ListadoCategoriasComponent implements OnInit {

  isLoading$;
  search: any = null;

  categorias: any = [];
  URL_BACKEND: any = URL_BACKEND;
  filteredCategorias: any = [];

  //paginacion
  pageSize = 5;
  desde: number = 0;
  hasta: number = 5;

  //filtro
  cboEstado: FormControl = new FormControl(-1);

  //listas
  lstEstados = [
    { nIdEstado: -1, cEstado: 'Todos' },
    { nIdEstado: 1, cEstado: 'Activo' },
    { nIdEstado: 0, cEstado: 'Inactivo' },
  ];


  constructor(


    public confirmService: ConfirmService,
    private _dialog: MatDialog,
    public _service: ServiciosGeneralService,
    public toaster: Toaster,
  ) {


  }

  ngOnInit(): void {
    this.isLoading$ = this._service.isLoading$;
    this.BotonListarCategorias();
  }

  public BotonListarCategorias() {
    this.search = '';
    this._service.GetCategorias(this.cboEstado.value).subscribe((resp: any) => {
      console.log('CATEGORIAS. ', resp);
      this.categorias = resp.categorias;
      this.filteredCategorias = [...this.categorias];
    })
  }



  public BotonNuevaCategoria() {
    const dialogRef = this._dialog.open(
      AddEditCategoriaComponent,
      {
        width: '750px',

        disableClose: true,
        data: {
          bEdit: false,
          cTitle: 'REGISTRAR CATEGORÍA',
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {

      this.BotonListarCategorias();
    });
  }

  BotonEditarCategoria(categoria: any) {
    console.log('Categoria Padre: ', categoria);
    const dialogRef = this._dialog.open(
      AddEditCategoriaComponent,
      {
        width: '750px',

        disableClose: true,
        data: {
          bEdit: true,
          cTitle: 'EDITAR CATEGORÍA',
          categoria: categoria
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {

      this.BotonListarCategorias();
    });
  }




  BotonEliminarCategoria(categoria) {
    console.log('categoria: ', categoria);
    var title = 'Remover Categoría: ' + categoria.name;
    var mensaje = '¿Está seguro que desea remover esta categoría?';

    //llamamos al servicio de confirmarEliminacion y le pasamos parámetros
    this.confirmService.confirmarEliminacion({ title: title, message: mensaje })
      .subscribe(result => {
        if (result) {
          /* Colocar aquí procedimiento al confirmar elimninación */

          this._service.RemoveCategoria(categoria).subscribe(
            (resp: any) => {

              if (resp.success) {
                this.toaster.open(NoticyAlertComponent, { text: `info-La categoría se removió exitosamente.` });
                categoria.nEstado = 0;
               /*  console.log('resp: ', resp); */

              } else {
                this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al remover la Categoría.'` });
              }
            },
            (error: any) => {
              console.error('Error al actualizar la categoría:', error);
              this.toaster.open(NoticyAlertComponent, { text: `danger-Ocurrió un error al remover la categoría.` });

            }
          )
        }

      });

  }

  public BuscarCategorias() {

  }


  cambiarPagina(e: PageEvent) {

    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }



}
