import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesComponent } from './clientes.component';
import { ListClienteComponent } from './list-cliente/list-cliente.component';
import { AddClienteComponent } from './add-cliente/add-cliente.component';
import { EditClienteComponent } from './edit-cliente/edit-cliente.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { DeleteClienteComponent } from './delete-cliente/delete-cliente.component';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [ClientesComponent, ListClienteComponent, AddClienteComponent, EditClienteComponent, DeleteClienteComponent],
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
    MatPaginatorModule,
  ]
})
export class ClientesModule { }
