import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProveedoresComponent } from './proveedores.component';
import { GestionarProveedorComponent } from './gestionar-proveedor/gestionar-proveedor.component';

const routes: Routes = [{
  path: '',
  component: ProveedoresComponent,
  children: [
  

    {
      path: 'gestionar-proveedores',
      component: GestionarProveedorComponent
    },
    {
      path: '', redirectTo: 'gestionar-proveedores', pathMatch: 'full',
    },
    {
      path: '**', redirectTo: 'gestionar-proveedores', pathMatch: 'full',
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProveedoresRoutingModule { }
