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
import { ProgressComponent } from './progress/progress.component';
import { ProgressStepComponent } from './progress/progress-step/progress-step.component';
import { ProgressStepDirective } from './progress/progress-step.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [VentasComponent, ListadoVentasComponent, PuntoVentaComponent, ProgressComponent, ProgressStepComponent, ProgressStepDirective],
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
    SpinnerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule
  ]
})
export class VentasModule { }
