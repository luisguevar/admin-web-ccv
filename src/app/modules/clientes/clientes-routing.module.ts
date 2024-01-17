import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientesComponent } from './clientes.component';
import { ListClienteComponent } from './list-cliente/list-cliente.component';

const routes: Routes = [
  {
    path: '',
    component: ClientesComponent,
    children: [
      {
        path: 'lista',
        component: ListClienteComponent
      },
      {
        path: '', redirectTo: 'lista', pathMatch: 'full',
      },
      {
        path: '**', redirectTo: 'lista', pathMatch: 'full',
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }
