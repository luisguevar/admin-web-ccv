import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { UsersListComponent } from './users-list/users-list.component';
import { AddUsersComponent } from './components/add-users/add-users.component';
import { EditUsersComponent } from './components/edit-users/edit-users.component';
import { EditColaboradorComponent } from './components/edit-colaborador/edit-colaborador.component';
import { DeleteUserComponent } from './components/delete-user/delete-user.component';
import { ChangeStateUserComponent } from './components/change-state-user/change-state-user.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { SpinnerModule } from 'src/app/shared/spinner/spinner.module';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [UsersComponent, UsersListComponent, AddUsersComponent, EditUsersComponent, EditColaboradorComponent, DeleteUserComponent, ChangeStateUserComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule,
    SpinnerModule,
    MatPaginatorModule,
  ]
})
export class UsersModule { }
