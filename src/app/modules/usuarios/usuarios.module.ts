import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosComponent } from './usuarios.component';
import { AddEditUsuarioComponent } from './add-edit-usuario/add-edit-usuario.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgbModule, NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { SpinnerModule } from 'src/app/shared/spinner/spinner.module';
import { ListadoUsuariosComponent } from './listado-usuarios/listado-usuarios.component';


@NgModule({
  declarations: [
    UsuariosComponent,
    AddEditUsuarioComponent,
    ListadoUsuariosComponent

  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
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
export class UsuariosModule { }
