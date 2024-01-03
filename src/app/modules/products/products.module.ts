import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { AddNewProductComponent } from './add-new-product/add-new-product.component';
import { LitsProductsComponent } from './lits-products/lits-products.component';
import { EditNewProductComponent } from './edit-new-product/edit-new-product.component';
import { DeleteNewProductComponent } from './delete-new-product/delete-new-product.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { EditorModule } from '@tinymce/tinymce-angular';
import { DeleteImagenPComponent } from './edit-new-product/delete-imagen-p/delete-imagen-p.component';
import { DeleteItemInventarioComponent } from './edit-new-product/in/delete-item-inventario/delete-item-inventario.component';
import { EditItemInventarioComponent } from './edit-new-product/in/edit-item-inventario/edit-item-inventario.component';
import { DeleteSubItemInventarioComponent } from './edit-new-product/in/delete-sub-item-inventario/delete-sub-item-inventario.component';
import { EditSubItemInventarioComponent } from './edit-new-product/in/edit-sub-item-inventario/edit-sub-item-inventario.component';


@NgModule({
  declarations: [ProductsComponent, AddNewProductComponent, LitsProductsComponent, EditNewProductComponent, DeleteNewProductComponent, DeleteImagenPComponent, DeleteItemInventarioComponent, EditItemInventarioComponent, DeleteSubItemInventarioComponent, EditSubItemInventarioComponent,],
  imports: [
    CommonModule,
    ProductsRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule,
    EditorModule
  ]
})
export class ProductsModule { }
