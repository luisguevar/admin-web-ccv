import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesComponent } from './clientes.component';
import { ListadoClientesComponent } from './listado-clientes/listado-clientes.component';
import { AddEditClienteComponent } from './add-edit-cliente/add-edit-cliente.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgbModule, NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { SpinnerModule } from 'src/app/shared/spinner/spinner.module';


@NgModule({
  declarations: [ClientesComponent, ListadoClientesComponent, AddEditClienteComponent],
  imports: [
    CommonModule,
    ClientesRoutingModule,
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
export class ClientesModule { }
