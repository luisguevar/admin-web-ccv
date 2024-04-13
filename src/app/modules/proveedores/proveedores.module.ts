import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProveedoresRoutingModule } from './proveedores-routing.module';
import { ProveedoresComponent } from './proveedores.component';
import { AddNewProveedorComponent } from './add-new-proveedor/add-new-proveedor.component';
import { ListProveedorComponent } from './list-proveedor/list-proveedor.component';
import { EditProveedorComponent } from './edit-proveedor/edit-proveedor.component';
import { DeleteProveedorComponent } from './delete-proveedor/delete-proveedor.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';/* 
import { SpinnerInterceptor } from 'src/app/shared/interceptors/spinner.interceptor'; */
import { SpinnerModule } from 'src/app/shared/spinner/spinner.module';
import { GestionarProveedorComponent } from './gestionar-proveedor/gestionar-proveedor.component';
import { AddEditContactoComponent } from './add-edit-contacto/add-edit-contacto.component';

@NgModule({
  declarations: [ProveedoresComponent, AddNewProveedorComponent, ListProveedorComponent, EditProveedorComponent, DeleteProveedorComponent, GestionarProveedorComponent, AddEditContactoComponent],
  imports: [
    CommonModule,
    ProveedoresRoutingModule,
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

  ],
 /*  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true }
  ] */
})
export class ProveedoresModule { }
