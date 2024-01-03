import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { ProductsService } from '../_services/products.service';
import { DeleteImagenPComponent } from './delete-imagen-p/delete-imagen-p.component';
import { DeleteItemInventarioComponent } from './in/delete-item-inventario/delete-item-inventario.component';
import { DeleteSubItemInventarioComponent } from './in/delete-sub-item-inventario/delete-sub-item-inventario.component';
import { EditItemInventarioComponent } from './in/edit-item-inventario/edit-item-inventario.component';
import { EditSubItemInventarioComponent } from './in/edit-sub-item-inventario/edit-sub-item-inventario.component';

@Component({
  selector: 'app-edit-new-product',
  templateUrl: './edit-new-product.component.html',
  styleUrls: ['./edit-new-product.component.scss']
})
export class EditNewProductComponent implements OnInit {

  isLoading$:any ;

  title:any = null;
  sku:any = null;
  categorie_id:any = '';
  price_soles:any = '';
  price_usd:any = '';
  resumen:any = null;
  description:any = null;

  categories:any = [];

  text:any = null;
  tags:any = [];

  imagen_file:any = null;
  imagen_previzualiza:any = null;

  images_files:any = [];
  img_files:any = null;
  img_previzualizar:any = null;

  product_id:any = null;
  product:any = {
    title: '',
  };
  // NUEVOS
  product_size_id:any = null;
  new_nombre:any = null;
  product_color_id:any = null;
  stock:any = null;
  products_colors:any = [];
  products_color_sizes:any = [];
  is_selected_dimension:Boolean = true;
  product_inventaries:any = [];
  checked_inventario:any = 1;
  stock_individual:any = 0;
  state:any = 1;
  constructor(
    public toaster:Toaster,
    public _productService: ProductsService,
    public router: Router,
    public activerouter: ActivatedRoute,
    public modelService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._productService.isLoading$;
    this.activerouter.params.subscribe((resp:any) => {
      this.product_id = resp["id"] || "";
    })
    this._productService.getInfo().subscribe((resp:any) => {
      this.categories = resp.categories;
      this.products_colors = resp.products_colors;
      this.products_color_sizes = resp.products_color_sizes;
    })
    this._productService.showProduct(this.product_id).subscribe((resp:any) => {
      console.log(resp);
      this.product = resp.product;
      this.title = this.product.title;
      this.sku = this.product.sku;
      this.categorie_id = this.product.categorie_id;
      this.price_soles = this.product.price_soles;
      this.price_usd = this.product.price_usd;
      this.resumen = this.product.resumen;
      this.description = this.product.description;
      this.tags = this.product.tags_a;
      this.imagen_previzualiza = this.product.imagen;
      this.images_files = this.product.images;
      this.product_inventaries = this.product.sizes;
      this.stock_individual = this.product.stock;
      this.checked_inventario = this.product.checked_inventario;
      this.state = this.product.state;
    })
  }

  loadServices(){
    this._productService.isLoadingSubject.next(true);
    setTimeout(() => {
      this._productService.isLoadingSubject.next(false)
    }, 50);
  }
  checkedInventario(value){
    this.checked_inventario = value;
  }
  processFile($event){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.toaster.open(NoticyAlertComponent,{text:`danger-'EL ARCHIVO CARGADO NO ES UNA IMAGEN'`});
      return;
    }
    this.imagen_file = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.imagen_file);
    reader.onloadend = () => this.imagen_previzualiza = reader.result;
    this.loadServices();
  }

  addTags(){
    this.tags.push(this.text)
    this.text = null;
  }
  removeTags(index){
    this.tags.splice(index,1);
  }

  addFile($event){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.toaster.open(NoticyAlertComponent,{text:`danger-'EL ARCHIVO CARGADO NO ES UNA IMAGEN'`});
      return;
    }
    this.img_files = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.img_files);
    reader.onloadend = () => this.img_previzualizar = reader.result;
  }

  addImages(){
    if(!this.img_files){
      this.toaster.open(NoticyAlertComponent,{text:`danger-'DEBES AGREGAR UNA IMAGEN'`});
      return;
    }
    let formaData = new FormData();
    formaData.append("product_id",this.product_id);
    formaData.append("file",this.img_files)
    this._productService.addImagenProduct(formaData).subscribe((resp:any) => {
      this.img_files = null;
      this.img_previzualizar = null;
      this.images_files.unshift(resp.imagen);
    })
  }

  removeImages(imagen_){
    // this.images_files.splice(index,1);
    const modalRef = this.modelService.open(DeleteImagenPComponent, {centered : true, size: 'sm'});
    modalRef.componentInstance.imagen_ = imagen_;
    modalRef.result.then(
      () => {

      },
      () => {
        
      }
    )
    modalRef.componentInstance.ImagenE.subscribe((resp:any) => {
      let INDEX = this.images_files.findIndex(item => item.id == resp.id);
      this.images_files.splice(INDEX,1);
    })
  }

  createProduct(){

    if(! this.title ||
      ! this.sku ||
      ! this.categorie_id ||
      ! this.price_soles ||
      ! this.price_usd ||
      ! this.resumen ||
      ! this.description){
        this.toaster.open(NoticyAlertComponent,{text:`danger-'TODOS LOS CAMPOS SON OBLIGATORIOS'`});
      return;
    }

    let formaData = new FormData();
    formaData.append("title",this.title);
    formaData.append("sku",this.sku)
    formaData.append("categorie_id",this.categorie_id)
    formaData.append("price_soles",this.price_soles)
    formaData.append("price_usd",this.price_usd)
    formaData.append("resumen",this.resumen)
    formaData.append("description",this.description)
    formaData.append("imagen_file",this.imagen_file)
    formaData.append("tags",this.tags)
    formaData.append("stock",this.stock_individual ? this.stock_individual : 0)
    formaData.append("type_inventario",this.checked_inventario)
    formaData.append("state",this.state);
    // let index = 0;
    // for (const imagen of this.images_files) {
    //   formaData.append("files["+index+"]",imagen.file);
    //   index++;
    // }

    this._productService.updateProduct(this.product_id,formaData).subscribe((resp:any) => {
      console.log(resp);
      this.toaster.open(NoticyAlertComponent,{text:`primary-'SE REGISTRO LOS CAMBIOS DEL PRODUCTO'`});
    })
  }

  OPENEDIT(inventario){
    const modalRef = this.modelService.open(EditItemInventarioComponent, {centered : true, size: 'sm'});
    modalRef.componentInstance.inventario = inventario;
    modalRef.result.then(
      () => {

      },
      () => {
        
      }
    )
    modalRef.componentInstance.inventarioG.subscribe((resp:any) => {
      console.log(resp);
      let INDEX = this.product_inventaries.findIndex(item => item.id == resp.id);
      if(INDEX!=-1){
        this.product_inventaries[INDEX] = resp;
      }
    })
  }
  OPENEDELETE(inventario){
    const modalRef = this.modelService.open(DeleteItemInventarioComponent, {centered : true, size: 'sm'});
    modalRef.componentInstance.inventario = inventario;
    modalRef.result.then(
      () => {

      },
      () => {
        
      }
    )
    modalRef.componentInstance.inventarioG.subscribe((resp:any) => {
      console.log(resp);
      let INDEX = this.product_inventaries.findIndex(item => item.id == resp.id);
      if(INDEX!=-1){
        this.product_inventaries.splice(INDEX,1);
      }
    })
  }

  OPENEDITSUB(sub_inventario,inventario){
    const modalRef = this.modelService.open(EditSubItemInventarioComponent, {centered : true, size: 'sm'});
    modalRef.componentInstance.sub_inventario = sub_inventario;
    modalRef.componentInstance.inventario = inventario;
    modalRef.componentInstance.products_colors = this.products_colors;
    modalRef.result.then(
      () => {

      },
      () => {
        
      }
    )
    modalRef.componentInstance.inventarioG.subscribe((resp:any) => {
      console.log(resp);
      let INDEX = this.product_inventaries.find(item => item.id == inventario.id).variaciones.findIndex(item => item.id == resp.id);
      if(INDEX!=-1){
        this.product_inventaries.find(item => item.id == inventario.id).variaciones[INDEX] = resp;
      }
    })
  }
  OPENEDELETESUB(sub_inventario,inventario){
    const modalRef = this.modelService.open(DeleteSubItemInventarioComponent, {centered : true, size: 'sm'});
    modalRef.componentInstance.sub_inventario = sub_inventario;
    modalRef.result.then(
      () => {

      },
      () => {
        
      }
    )
    modalRef.componentInstance.inventarioG.subscribe((resp:any) => {
      console.log(resp);
      let INDEX = this.product_inventaries.find(item => item.id == inventario.id).variaciones.findIndex(item => item.id == resp.id);
      if(INDEX!=-1){
        this.product_inventaries.find(item => item.id == inventario.id).variaciones.splice(INDEX,1);
      }
    })
  }

  changeDimension(value){
    if(value){
      this.is_selected_dimension = false;
    }else{
      this.is_selected_dimension = true;
    }
  }

  addInventario() {
    if(!this.product_size_id){
      if(!this.new_nombre){
        this.toaster.open(NoticyAlertComponent,{text:`danger-'TIENES QUE INGRESAR EL NOMBRE DE LA DIMENSION'`});
        return;
      }
    }
    if(!this.product_color_id){
      this.toaster.open(NoticyAlertComponent,{text:`danger-'TIENES QUE SELECCIONAR UN COLOR'`});
        return;
    }
    if(!this.stock){
      this.toaster.open(NoticyAlertComponent,{text:`danger-'TIENES QUE INGRESAR EL STOCK'`});
      return;
    }
    let data = {
      product_id: this.product_id,
      product_color_id: this.product_color_id,
      product_size_id: this.product_size_id,
      new_nombre: this.new_nombre,
      stock: this.stock,
    }
    this._productService.addInvetario(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open(NoticyAlertComponent,{text:`danger-'${resp.text_message}'`});
        return;
      }else{
        this.toaster.open(NoticyAlertComponent,{text:`primary-'SE REGISTRO CORRECTAMENTE LA CONFIGURACIÓN'`});
        this.product_color_id = null;
        this.product_size_id = null;
        this.new_nombre = null;
        this.stock = null;
        let INDEX = this.product_inventaries.findIndex(item => item.id == resp.product_size_color.id);
        if(INDEX != -1){
          this.product_inventaries[INDEX] = resp.product_size_color;
        }else{
          this.product_inventaries.push(resp.product_size_color);
        }
      }
    })
  }
}
