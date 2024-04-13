import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProveedoresComponent } from './proveedores.component';
import { AddNewProveedorComponent } from './add-new-proveedor/add-new-proveedor.component';
import { ListProveedorComponent } from './list-proveedor/list-proveedor.component';
import { EditProveedorComponent } from './edit-proveedor/edit-proveedor.component';
import { GestionarProveedorComponent } from './gestionar-proveedor/gestionar-proveedor.component';

const routes: Routes = [{
  path: '',
  component: ProveedoresComponent,
  children: [
    {
      path: 'add-new-proveedor',
      component: AddNewProveedorComponent
    },
    {
      path: 'list-proveedor',
      component: ListProveedorComponent
    },
    {
      path: 'edit-proveedor/:id',
      component: EditProveedorComponent
    },

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
