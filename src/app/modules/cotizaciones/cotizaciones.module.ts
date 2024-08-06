import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CotizacionesRoutingModule } from './cotizaciones-routing.module';
import { CotizacionesComponent } from './cotizaciones.component';
import { NgbDatepickerModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { GestionarCotizacionComponent } from './gestionar-cotizacion/gestionar-cotizacion.component';
import { SpinnerModule } from 'src/app/shared/spinner/spinner.module';

@NgModule({
  declarations: [CotizacionesComponent, GestionarCotizacionComponent],
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
    MatPaginatorModule,
    SpinnerModule
  ]
})
export class CotizacionesModule { }
