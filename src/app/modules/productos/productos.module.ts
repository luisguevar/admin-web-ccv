import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductosRoutingModule } from './productos-routing.module';
import { ProductosComponent } from './productos.component';
import { ListadoProductosComponent } from './listado-productos/listado-productos.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgbModule, NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { EditorModule } from '@tinymce/tinymce-angular';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { SpinnerModule } from 'src/app/shared/spinner/spinner.module';
import { AddEditProductoComponent } from './add-edit-producto/add-edit-producto.component'


@NgModule({
  declarations: [ ProductosComponent, ListadoProductosComponent, AddEditProductoComponent],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule,
    EditorModule,
    SpinnerModule,
    MatPaginatorModule

  ]
})
export class ProductosModule { }
