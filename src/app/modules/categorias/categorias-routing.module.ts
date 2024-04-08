import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriasComponent } from './categorias.component';
import { ListadoCategoriasComponent } from './listado-categorias/listado-categorias.component';

const routes: Routes = [
  {
    path: '',
    component: CategoriasComponent,
    children: [
      {
        path: 'listado-categorias',
        component: ListadoCategoriasComponent
      },
      {
        path: '', redirectTo: 'listado-categorias', pathMatch: 'full',
      },
      {
        path: '**', redirectTo: 'listado-categorias', pathMatch: 'full',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriasRoutingModule { }
