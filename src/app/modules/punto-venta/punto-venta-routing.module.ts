import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PuntoVentaComponent } from './punto-venta.component';
import { CreatePuntoVentaComponent } from './create-punto-venta/create-punto-venta.component';

const routes: Routes = [{
  path: '',
  component: PuntoVentaComponent,
  children: [
    {
      path: 'add-new-sale',
      component: CreatePuntoVentaComponent
    },
    /*  {
       path: 'list-proveedor',
       component: ListProveedorComponent
     },
     {
       path: 'edit-proveedor/:id',
       component: EditProveedorComponent
     }, */
    {
      path: '', redirectTo: 'add-new-sale', pathMatch: 'full',
    },
    {
      path: '**', redirectTo: 'add-new-sale', pathMatch: 'full',
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PuntoVentaRoutingModule { }
