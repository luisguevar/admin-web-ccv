import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategorieListComponent } from './categorie-list/categorie-list.component';
import { CategorieComponent } from './categorie.component';

"localhost:4200/categorias/edit"
const routes: Routes = [
  {
    path: '',
    component: CategorieComponent,
    children: [
      {
        path: 'lista',
        component: CategorieListComponent
      },
      {
        path: '',redirectTo: 'lista', pathMatch: 'full',
      },
      {
        path: '**',redirectTo: 'lista', pathMatch: 'full',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategorieRoutingModule { }
