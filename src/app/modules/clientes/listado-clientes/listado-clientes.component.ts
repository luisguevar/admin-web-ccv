import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ServiciosGeneralService } from '../../servicios-general.service';
import { Toaster } from 'ngx-toast-notifications';
import { AddEditClienteComponent } from '../add-edit-cliente/add-edit-cliente.component';
import { ConfirmService } from 'src/app/shared/confirm/confirm.service';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-listado-clientes',
  templateUrl: './listado-clientes.component.html',
  styleUrls: ['./listado-clientes.component.scss']
})
export class ListadoClientesComponent implements OnInit {

  isLoading$;
  isLoading = false;

  totalPages = 1;
  currentPage = 1;

  state: any = 1;
  search: any = '';


  //paginacion
  pageSize = 5;
  desde: number = 0;
  hasta: number = 5;

  cboEstado: FormControl = new FormControl(-1);
  //listas
  lstEstados = [
    { nIdEstado: -1, cEstado: 'Todos' },
    { nIdEstado: 1, cEstado: 'Activo' },
    { nIdEstado: 0, cEstado: 'Inactivo' },
  ];
  filteredClientes: any = [];
  clientes: any;
  cliente_id: number = 0;


  constructor(
    private _dialog: MatDialog,
    public _service: ServiciosGeneralService,
    public toaster: Toaster,
    public confirmService: ConfirmService,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._service.isLoading$;
    this.BotonListarClientes();
  }

  public BotonListarClientes() {
    this.search = '';
    this._service.GetClientes(this.cboEstado.value).subscribe((resp: any) => {
      /* console.log(resp); */
      this.clientes = resp.clientes;
      this.filteredClientes = [...this.clientes];
    });
  }

  public BotonNuevoCliente() {
    const dialogRef = this._dialog.open(
      AddEditClienteComponent,
      {
        width: '650px',
        disableClose: true,
        data: {
          bEdit: false,
          cTitle: 'Registrar Nuevo Cliente',
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {

      this.BotonListarClientes();
    });
  }

  public BotonEditarCliente(cliente) {
    const dialogRef = this._dialog.open(
      AddEditClienteComponent,
      {
        width: '650px',
        disableClose: true,
        data: {
          bEdit: true,
          cTitle: 'Editar Cliente',
          cliente: cliente
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {

      this.BotonListarClientes();
    });
  }

  public BotonRemoverCliente(cliente) {
    var title = '';
    var mensaje = ' ';

    title = 'Eliminar Cliente: ' + cliente.cNombres + ' ' + cliente.cApellidos;
    mensaje = '¿Está seguro que desea eliminar este cliente?';

    //llamamos al servicio de confirmarEliminacion y le pasamos parámetros
    this.confirmService.confirmarEliminacion({ title: title, message: mensaje })
      .subscribe(result => {
        if (result) {

          var data: any = null;
          this.cliente_id = cliente.id;

          data = {
            'nEstado': 0,
            'cUsuarioModificacion': this.cliente_id
          }
          this._service.PutClientes(this.cliente_id, data).subscribe((resp: any) => {
            /*   console.log('CREATE: ', resp); */

            if (resp.success) {
              cliente.nEstado = 0;
              if (this.cboEstado.value == 1) {
                this.filteredClientes = this.filteredClientes.filter(x => x != cliente);
              }
              this.toaster.open(NoticyAlertComponent, { text: `info-'Estado actualizado correctamente'` });

            } else {
              this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar el Cliente.'` });
            }


          },
            (error: any) => {
              /* console.error('Error al guardar la categoría:', error); */
              this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar el Cliente.'` });
              return;
            }


          )
        }

      });


  }

  buscarClientes() {
    // Filtra la lista completa de clientes según el término de búsqueda
    const usuariosFiltrados = this.clientes.filter(user =>
      user.cNombres.toLowerCase().includes(this.search.toLowerCase()) ||
      user.cApellidos.toLowerCase().includes(this.search.toLowerCase()) ||
      user.cCorreo.toLowerCase().includes(this.search.toLowerCase()) ||
      user.cNroDocumento.toLowerCase().includes(this.search.toLowerCase())
    );

    // Asigna la lista filtrada a filteredClientes y luego aplica la paginación
    this.filteredClientes = usuariosFiltrados;
    this.desde = 0;  // Reinicia la paginación a la primera página
    this.hasta = this.pageSize;
  }
  cambiarPagina(e: PageEvent) {
    /*   console.log(e); */
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }

}
