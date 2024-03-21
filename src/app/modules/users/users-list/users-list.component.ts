import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddUsersComponent } from '../components/add-users/add-users.component';
import { DeleteUserComponent } from '../components/delete-user/delete-user.component';
import { EditUsersComponent } from '../components/edit-users/edit-users.component';
import { UsersService } from '../_services/users.service';
import { PageEvent } from '@angular/material/paginator';
import { ConfirmService } from 'src/app/shared/confirm/confirm.service';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  isLoading$;
  isLoading = false;

  totalPages = 1;
  currentPage = 1;

  state: any = 1;
  search: any = '';
  filteredUsuarios: any = [];
  //paginacion
  pageSize = 5;
  desde: number = 0;
  hasta: number = 5;


  users: any = [];
  constructor(
    public fb: FormBuilder,
    public _userService: UsersService,
    public modelService: NgbModal,
    public confirmService: ConfirmService,
    public toaster: Toaster,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._userService.isLoading$;
    this.allUsers();
  }

  allUsers(page = 1) {
    this._userService.allUsers(page, this.state, this.search).subscribe((resp: any) => {
      console.log(resp);
      this.users = resp.users.data;
      this.filteredUsuarios = [...this.users];
    });
  }

  reset() {
    this.state = '';
    this.search = '';
    this.allUsers();
  }
  addUser() {
    const modalRef = this.modelService.open(AddUsersComponent, { centered: true, size: 'md' });
    modalRef.result.then(
      () => {

      },
      () => {

      }
    )
    modalRef.componentInstance.usersE.subscribe((resp: any) => {
      console.log(resp);
      resp.state = 1;
      this.users.unshift(resp);
    })
  }

  editUser(user) {
    const modalRef = this.modelService.open(EditUsersComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.user_selected = user;

    modalRef.componentInstance.usersE.subscribe((resp: any) => {
      if (resp) {
        this.allUsers();
        this.toaster.open(NoticyAlertComponent, { text: `success-'El usuario se actualizó exitosamente.'` });
      }
    })
  }

  delete(user) {
    const modalRef = this.modelService.open(DeleteUserComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.user_selected = user;
    modalRef.result.then(
      () => {

      },
      () => {

      }
    )
    modalRef.componentInstance.usersE.subscribe((resp: any) => {
      console.log(resp);
      let INDEX = this.users.findIndex(user => user.id == resp.id);
      this.users.splice(INDEX, 1);
    })
  }


  loadPage(index) {
    this.allUsers(index);
  }

  removerUsuario(user) {

    if (user.state == 1) {
      var title = 'Desactivar Usuario: ' + user.name + ' ' + user.surname;
      var mensaje = '¿Está seguro que desea desactivar este usuario?';
    } else {

      var title = 'Activar Usuario: ' + user.name + ' ' + user.surname;
      var mensaje = '¿Está seguro que desea activar este usuario?';
    }


    //llamamos al servicio de confirmarEliminacion y le pasamos parámetros
    this.confirmService.confirmarEliminacion({ title: title, message: mensaje })
      .subscribe(result => {
        if (result) {
          /* Colocar aquí procedimiento al confirmar elimninación */

          this._userService.removeUser(user).subscribe(
            (resp: any) => {

              if (resp.success) {

                if (user.state == 1) {
                  this.toaster.open(NoticyAlertComponent, { text: `info-El usuario se desactivo exitosamente.` });
                  this.filteredUsuarios = this.filteredUsuarios.filter((item) => item != user);
                  this.state = 1;
                  return;
                } else {
                  this.toaster.open(NoticyAlertComponent, { text: `info-El usuario se activó exitosamente.` });
                  this.filteredUsuarios = this.filteredUsuarios.filter((item) => item != user);
                  this.state = 2;
                  return;
                }


              }
            },
            (error: any) => {
              console.error('Error al actualizar el usuario:', error);
              this.toaster.open(NoticyAlertComponent, { text: `danger-Ocurrió un error al desactivar el usuario.` });
              this.reset();
              return;
            }
          )
        }

      });
  }

  buscarUsuarios() {
    // Filtra la lista completa de clientes según el término de búsqueda
    const usuariosFiltrados = this.users.filter(user =>
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
