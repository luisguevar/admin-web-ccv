import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { CuponesService } from '../_services/cupones.service';

@Component({
  selector: 'app-edit-new-cupon',
  templateUrl: './edit-new-cupon.component.html',
  styleUrls: ['./edit-new-cupon.component.scss']
})
export class EditNewCuponComponent implements OnInit {

  isLoading$:any;

  code:any;
  type_discount:any = 1;
  discount:any = null;
  type_count: any = 1;
  num_use:any = 0;
  type_cupon:any = 1;
  categories_selected:any = [];
  products_selected:any = [];

  categories:any = [];
  products:any = [];

  product_id:any = null;
  categorie_id:any = null;

  cupon:any = {
    code: '',
  }
  cupon_id:any = null;

  state:any = 1;
  constructor(
    public _cuponesServices:CuponesService,
    public toaster:Toaster,
    public router: Router,
    public activerouter: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._cuponesServices.isLoadingSubject;
    this.activerouter.params.subscribe((resp:any) => {
      this.cupon_id = resp["id"] || "";
    })
    this.configAll();
    this.showCupon();
  }
  configAll(){
    this._cuponesServices.configAll().subscribe((resp:any)=>{
      console.log(resp);
      this.categories = resp.categories;
      this.products = resp.products;
    });
  }
  showCupon(){
    this._cuponesServices.showCupon(this.cupon_id).subscribe((resp:any) => {
      console.log(resp);
      this.cupon = resp.cupone;
      this.code = this.cupon.code;
      this.type_discount = this.cupon.type_discount;
      this.discount = this.cupon.discount;
      this.type_count = this.cupon.type_count;
      this.num_use = this.cupon.num_use;
      
      this.state = this.cupon.state;
      this.type_cupon = this.cupon.products ? 1 : 2;
      // console.log(this.type_cupon);
      if(this.type_cupon == 1){
        // 2-3-4 => [2,3,4]
        let PRODUCTS = this.cupon.products.split(",");
        PRODUCTS.forEach(prod_id => {
          let PRODUCT = this.products.find(item => item.id == prod_id);
          this.products_selected.push({
            name: PRODUCT.title,
            id:PRODUCT.id,
          })
        });
      }
      if(this.type_cupon == 2){
        let CATEGORIES = this.cupon.categories.split(",");
        CATEGORIES.forEach(cate_id => {
          let CATEGORIE = this.categories.find(item => item.id == cate_id);
          this.categories_selected.push({
            name: CATEGORIE.name,
            id:CATEGORIE.id,
          })
        });
      }

    })
  }
  checkedTypeD(value){
    this.type_discount = value;
  }
  checkedTypeC(value){
    this.type_count = value;
  }
  checkedTypePC(value){
    this.type_cupon = value;
    this.products_selected = [];
    this.categories_selected = [];
    this.product_id = null;
    this.categorie_id = null;
  }

  addObject(){
    if(this.type_cupon == 1){
      let PRODUCT = this.products.find(item => item.id == this.product_id);
      let INDEX = this.products_selected.findIndex(item => item.id == this.product_id);
      if(INDEX != -1){
        this.toaster.open(NoticyAlertComponent,{text:`danger-'EL PRODUCTO YA FUE SELECCIONADO.'`});
        return;
      }else{
        this.product_id = null;
        this.products_selected.push({
          name: PRODUCT.title,
          id:PRODUCT.id,
        });
      }
    }else{
      let CATEGORIA = this.categories.find(item => item.id == this.categorie_id);
      let INDEX = this.categories_selected.findIndex(item => item.id == this.categorie_id);
      if(INDEX != -1){
        this.toaster.open(NoticyAlertComponent,{text:`danger-'EL CATEGORIA YA FUE SELECCIONADO.'`});
        return;
      }else{
        this.categorie_id = null;
        this.categories_selected.push({
          name: CATEGORIA.name,
          id:CATEGORIA.id,
        });
      }
    }
  }

  productD(productS){
    let INDEX = this.products_selected.findIndex(item => item.id == productS.id);
    if(INDEX != -1){
      this.products_selected.splice(INDEX,1);
    }
  }
  categorieD(categoriaS){
    let INDEX = this.categories_selected.findIndex(item => item.id == categoriaS.id);
    if(INDEX != -1){
      this.categories_selected.splice(INDEX,1);
    }
  }

  newCupon(){
    if(!this.code){
      this.toaster.open(NoticyAlertComponent,{text:`danger-'NECESITAS DIGITAR UN CODIGO DE CUPON.'`});
      return;
    }
    if(this.discount <= 0){
      this.toaster.open(NoticyAlertComponent,{text:`danger-'EL DESCUENTO TIENE QUE SER MAYOR A 0.'`});
      return;
    }
    if(this.type_count == 2 && this.num_use <= 0){
      this.toaster.open(NoticyAlertComponent,{text:`danger-'EL NUMERO DE USO TIENE QUE SER MAYOR A 0.'`});
      return;
    }
    if(this.type_cupon == 1 && this.products_selected.length == 0){
      this.toaster.open(NoticyAlertComponent,{text:`danger-'NECESITAS AGREGAR UN PRODUCTO.'`});
      return;
    }
    if(this.type_cupon == 2 && this.categories_selected.length == 0){
      this.toaster.open(NoticyAlertComponent,{text:`danger-'NECESITAS AGREGAR UNA CATEGORIA.'`});
      return;
    }

    let data = {
      code: this.code,
      type_discount: this.type_discount,
      discount: this.discount,
      type_count: this.type_count,
      num_use: this.num_use,
      type_cupon: this.type_cupon,
      products_selected: this.products_selected,
      categories_selected: this.categories_selected,
      state: this.state,
    }

    this._cuponesServices.updateCupones(this.cupon.id,data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open(NoticyAlertComponent,{text:`danger-'${resp.message_text}.'`});
        return;
      }else{
        this.toaster.open(NoticyAlertComponent,{text:`primary-'SE HA REGISTRADO LOS CAMBIOS DEL CUPON PERFECTAMENTE.'`});
        return;
      }
    })
  }

}
