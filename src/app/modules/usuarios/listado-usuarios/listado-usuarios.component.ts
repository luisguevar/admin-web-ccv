import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PageEvent } from '@angular/material/paginator';
import { ConfirmService } from 'src/app/shared/confirm/confirm.service';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

import { MatDialog } from '@angular/material/dialog';
import { ServiciosGeneralService } from '../../servicios-general.service';
import { AddEditUsuarioComponent } from '../add-edit-usuario/add-edit-usuario.component';
import { AuthService } from '../../auth';


@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.scss']
})
export class ListadoUsuariosComponent implements OnInit {

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

  users: any = [];
  usuarios: any = [];
  filteredUsuarios: any = [];
  usuario_id: any;
  usuario_dni: string = '';

  constructor(
    public fb: FormBuilder,
    public modelService: NgbModal,
    public confirmService: ConfirmService,
    /*   public toaster: Toaster, */
    private _dialog: MatDialog,
    public _service: ServiciosGeneralService,
    public toaster: Toaster,
    public authservice: AuthService
  ) {
    this.usuario_dni = this.authservice.user.cDocumento;


  }

  ngOnInit(): void {
    this.isLoading$ = this._service.isLoading$;
    this.BotonListarUsuarios();

  }

  BotonListarUsuarios() {
    this.search = '';
    this._service.GetUsuarios(this.cboEstado.value).subscribe((resp: any) => {
      console.log(resp);
      this.usuarios = resp.usuarios;
      this.filteredUsuarios = [...this.usuarios];
    });
  }

  public BotonNuevoUsuario() {
    const dialogRef = this._dialog.open(
      AddEditUsuarioComponent,
      {
        width: '750px',
        disableClose: true,
        data: {
          bEdit: false,
          cTitle: 'Registrar Nuevo Usuario',
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {

      this.BotonListarUsuarios();
    });
  }

  BotonEditarUsuario(usuario: any) {
    if (this.usuario_dni == usuario.cDocumento) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'No puede efectuar cambios en su propio usuario.'` });
      return;
    }
    const dialogRef = this._dialog.open(
      AddEditUsuarioComponent,
      {
        width: '750px',
        disableClose: true,
        data: {
          bEdit: true,
          cTitle: 'Editar Usuario',
          usuario: usuario
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {

      this.BotonListarUsuarios();
    });
  }


  BotonRemoverReiniciarUsuario(user, nAccion) {

    if (this.usuario_dni == user.cDocumento) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'No puede efectuar cambios en su propio usuario.'` });
      return;
    }


    var title = '';
    var mensaje = ' ';
    if (nAccion == 1) {
      title = 'Eliminar Usuario: ' + user.cNombres + ' ' + user.cApellidos;
      mensaje = '¿Está seguro que desea eliminar este usuario?';

      //llamamos al servicio de confirmarEliminacion y le pasamos parámetros
      this.confirmService.confirmarEliminacion({ title: title, message: mensaje })
        .subscribe(result => {
          if (result) {

            var data: any = null;
            this.usuario_id = user.id;

            data = {
              'nEstado': 0,
              'cUsuarioModificacion': this.usuario_id
            }
            this._service.PutUsuarios(this.usuario_id, data).subscribe((resp: any) => {
              /*   console.log('CREATE: ', resp); */

              if (resp.success) {
                user.nEstado = 0;
                if (this.cboEstado.value == 1) {
                  this.filteredUsuarios = this.filteredUsuarios.filter(x => x != user);
                }

                this.toaster.open(NoticyAlertComponent, { text: `info-'Estado actualizado correctamente'` });

              } else {
                this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar el Usuario.'` });
              }


            },
              (error: any) => {
                /* console.error('Error al guardar la categoría:', error); */
                this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar el Usuario.'` });
                return;
              }


            )
          }

        });

    } else {
      title = 'Restablecer Contraseña de: ' + user.cNombres + ' ' + user.cApellidos;
      mensaje = '¿Está seguro que desea restablecer esta contraseña?';

      //llamamos al servicio de confirmarEliminacion y le pasamos parámetros
      this.confirmService.confirmarGrabacion({ title: title, message: mensaje })
        .subscribe(result => {
          if (result) {

            var data: any = null;
            this.usuario_id = user.id;

            data = {
              'password': user.cDocumento,
              'cUsuarioModificacion': this.usuario_id
            }

            this._service.PutUsuarios(this.usuario_id, data).subscribe((resp: any) => {
              /*   console.log('CREATE: ', resp); */

              if (resp.success) {
                this.toaster.open(NoticyAlertComponent, { text: `info-'Contraseña reiniciada correctamente'` });

              } else {
                this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar el Usuario.'` });
              }


            },
              (error: any) => {
                /* console.error('Error al guardar la categoría:', error); */
                this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar el Usuario.'` });
                return;
              }


            )
          }

        });

    }




  }





  buscarUsuarios() {
    // Filtra la lista completa de clientes según el término de búsqueda
    const usuariosFiltrados = this.usuarios.filter(user =>
      user.name.toLowerCase().includes(this.search.toLowerCase()) ||
      user.surname.toLowerCase().includes(this.search.toLowerCase()) ||
      user.email.toLowerCase().includes(this.search.toLowerCase())
    );

    // Asigna la lista filtrada a filteredClientes y luego aplica la paginación
    this.filteredUsuarios = usuariosFiltrados;
    this.desde = 0;  // Reinicia la paginación a la primera página
    this.hasta = this.pageSize;
  }
  cambiarPagina(e: PageEvent) {
    /*   console.log(e); */
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }

}
