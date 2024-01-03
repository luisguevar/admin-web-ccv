import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CotizacionesComponent } from './cotizaciones.component';
import { AddNewCotizacionComponent } from './add-new-cotizacion/add-new-cotizacion.component';
import { ListCotizacionComponent } from './list-cotizacion/list-cotizacion.component';
import { EditCotizacionComponent } from './edit-cotizacion/edit-cotizacion.component';

const routes: Routes = [{
  path: '',
  component: CotizacionesComponent,
  children: [
    {
      path: 'add-new-cotizacion',
      component: AddNewCotizacionComponent
    },
    {
      path: 'list-cotizacion',
      component: ListCotizacionComponent
    },
    {
      path: 'edit-cotizacion/:id',
      component: EditCotizacionComponent
    },
    {
      path: '', redirectTo: 'add-cotizacion', pathMatch: 'full',
    },
    {
      path: '**', redirectTo: 'add-cotizacion', pathMatch: 'full',
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CotizacionesRoutingModule { }
