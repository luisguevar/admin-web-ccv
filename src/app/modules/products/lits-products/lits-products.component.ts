import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../_services/products.service';

@Component({
  selector: 'app-lits-products',
  templateUrl: './lits-products.component.html',
  styleUrls: ['./lits-products.component.scss']
})
export class LitsProductsComponent implements OnInit {

  products:any = [];
  isLoading$:any = null;

  search:any = null;
  constructor(
    public _productServices: ProductsService
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._productServices.isLoadingSubject;
    this.allProducts();
  }

  allProducts(page=1){
    let LINK = "";
    if(this.search){
      LINK = LINK + "&search="+this.search;
    }
    this._productServices.allProducts(page,LINK).subscribe((resp:any) => {
      console.log(resp);
      this.products = resp.products.data;
    })
  }

  reset(){
    this.search = null;
    this.allProducts();
  }
  edit(product) {

  }
  delete(product) {

  }

}
