import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CotizacionesRoutingModule } from './cotizaciones-routing.module';
import { CotizacionesComponent } from './cotizaciones.component';
import { AddNewCotizacionComponent } from './add-new-cotizacion/add-new-cotizacion.component';
import { ListCotizacionComponent } from './list-cotizacion/list-cotizacion.component';
import { EditCotizacionComponent } from './edit-cotizacion/edit-cotizacion.component';
import { DeleteCotizacionComponent } from './delete-cotizacion/delete-cotizacion.component';
import { NgbDatepickerModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import {MatPaginatorModule} from '@angular/material/paginator';

@NgModule({
  declarations: [CotizacionesComponent, AddNewCotizacionComponent, ListCotizacionComponent, EditCotizacionComponent, DeleteCotizacionComponent],
  imports: [
    CommonModule,
    CotizacionesRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule,
    MatPaginatorModule
  ]
})
export class CotizacionesModule { }
