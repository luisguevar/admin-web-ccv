import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductosComponent } from './productos.component';
import { ListadoProductosComponent } from './listado-productos/listado-productos.component';

const routes: Routes = [{
  path: '',
  component: ProductosComponent,
  children: [
    
    {
      path: 'listado-productos',
      component: ListadoProductosComponent
    },
   
    {
      path: '', redirectTo: 'listado-productos', pathMatch: 'full',
    },
    {
      path: '**', redirectTo: 'listado-productos', pathMatch: 'full',
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosRoutingModule { }
