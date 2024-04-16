import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PuntoVentaRoutingModule } from './punto-venta-routing.module';
import { PuntoVentaComponent } from './punto-venta.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { CreatePuntoVentaComponent } from './create-punto-venta/create-punto-venta.component';

@NgModule({
  declarations: [PuntoVentaComponent, CreatePuntoVentaComponent],
  imports: [
    CommonModule,
    PuntoVentaRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule,
   
  ]

 
})
export class PuntoVentaModule { }
