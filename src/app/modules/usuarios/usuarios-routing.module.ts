import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosComponent } from './usuarios.component';
import { ListadoUsuariosComponent } from './listado-usuarios/listado-usuarios.component';


const routes: Routes = [
  {
    path: '',
    component: UsuariosComponent,
    children: [
      {
        path: 'listado-usuarios',
        component: ListadoUsuariosComponent,
      },
      // {
      //   path: 'mi-perfil',
      //   component: UsersProfileCComponent
      // },
      { path: '', redirectTo: 'listado-usuarios', pathMatch: 'full' },
      { path: '**', redirectTo: 'listado-usuarios', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
