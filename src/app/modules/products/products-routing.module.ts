import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddNewProductComponent } from './add-new-product/add-new-product.component';
import { EditNewProductComponent } from './edit-new-product/edit-new-product.component';
import { LitsProductsComponent } from './lits-products/lits-products.component';
import { ProductsComponent } from './products.component';

// "localhost:4200/products/edit-product/3"
const routes: Routes = [{
  path: '',
  component: ProductsComponent,
  children: [
    {
      path: 'add-product',
      component: AddNewProductComponent
    },
    {
      path: 'list-product',
      component: LitsProductsComponent
    },
    {
      path: 'edit-product/:id',
      component: EditNewProductComponent
    },
    {
      path: '',redirectTo: 'add-product', pathMatch: 'full',
    },
    {
      path: '**',redirectTo: 'add-product', pathMatch: 'full',
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
