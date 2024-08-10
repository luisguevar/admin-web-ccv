import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VentasComponent } from './ventas.component';
import { PuntoVentaComponent } from './punto-venta/punto-venta.component';
import { ListadoVentasComponent } from './listado-ventas/listado-ventas.component';

const routes: Routes = [{
  path: '',
  component: VentasComponent,
  children: [


    {
      path: 'punto-venta',
      component: PuntoVentaComponent
    },

    {
      path: 'gestionar-ventas/:correlativo',
      component: ListadoVentasComponent
    },
    {
      path: '', redirectTo: 'punto-venta', pathMatch: 'full',
    },
    {
      path: '**', redirectTo: 'punto-venta', pathMatch: 'full',
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
