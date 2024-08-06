import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CotizacionesComponent } from './cotizaciones.component';
import { GestionarCotizacionComponent } from './gestionar-cotizacion/gestionar-cotizacion.component';

const routes: Routes = [{
  path: '',
  component: CotizacionesComponent,
  children: [


    {
      path: 'gestionar-cotizaciones',
      component: GestionarCotizacionComponent
    },
    {
      path: '', redirectTo: 'gestionar-cotizaciones', pathMatch: 'full',
    },
    {
      path: '**', redirectTo: 'gestionar-cotizaciones', pathMatch: 'full',
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CotizacionesRoutingModule { }
