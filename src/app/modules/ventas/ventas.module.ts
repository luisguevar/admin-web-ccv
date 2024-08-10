import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentasRoutingModule } from './ventas-routing.module';
import { VentasComponent } from './ventas.component';
import { ListadoVentasComponent } from './listado-ventas/listado-ventas.component';
import { PuntoVentaComponent } from './punto-venta/punto-venta.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SpinnerModule } from 'src/app/shared/spinner/spinner.module';


@NgModule({
  declarations: [VentasComponent, ListadoVentasComponent, PuntoVentaComponent],
  imports: [
    CommonModule,
    VentasRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule,
    MatPaginatorModule,
    SpinnerModule
  ]
})
export class VentasModule { }
