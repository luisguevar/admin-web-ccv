import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductosComponent } from './productos.component';
import { AddProductoComponent } from './add-producto/add-producto.component';
import { ListadoProductosComponent } from './listado-productos/listado-productos.component';
import { EditProductoComponent } from './edit-producto/edit-producto.component';

const routes: Routes = [{
  path: '',
  component: ProductosComponent,
  children: [
    {
      path: 'add-producto',
      component: AddProductoComponent
    },
    {
      path: 'listado-productos',
      component: ListadoProductosComponent
    },
    {
      path: 'edit-producto/:id',
      component: EditProductoComponent
    },
    {
      path: '', redirectTo: 'add-producto', pathMatch: 'full',
    },
    {
      path: '**', redirectTo: 'add-producto', pathMatch: 'full',
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosRoutingModule { }
