import { Component, OnInit } from '@angular/core';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { CategorieService } from '../../categorie/_services/categorie.service';
import { ProductsService } from '../_services/products.service';
import { ProveedorService } from '../../proveedores/_service/proveedor.service';

@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.scss']
})
export class AddNewProductComponent implements OnInit {

  isLoading$: any;

  title: any = null;
  sku: any = null;
  categorie_id: any = '';
  price_soles: any = '';
  price_usd: any = '';
  resumen: any = null;
  description: any = null;

  categories: any = [];

  text: any = null;
  tags: any = [];

  imagen_file: any = null;
  imagen_previzualiza: any = null;

  images_files: any = [];
  img_files: any = null;
  img_previzualizar: any = null;

  state:any = 1;
  proveedor_id: any = null;
  precioCompra: any = null;
  fechaCompra: any = null;
  stock_individual: any = null;

  lstProveedores: any = [];

  constructor(
    public toaster: Toaster,
    public _productService: ProductsService,
    public _proveedorService: ProveedorService,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._productService.isLoading$;
    this.allProveedores();
    this._productService.getInfo().subscribe((resp: any) => {
      this.categories = resp.categories;
    })
   
  }

  loadServices() {
    this._productService.isLoadingSubject.next(true);
    setTimeout(() => {
      this._productService.isLoadingSubject.next(false)
    }, 50);
  }

  processFile($event) {
    if ($event.target.files[0].type.indexOf("image") < 0) {
      this.toaster.open(NoticyAlertComponent, { text: `danger-El archivo cargado no es una imagen.` });
      return;
    }
    this.imagen_file = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.imagen_file);
    reader.onloadend = () => this.imagen_previzualiza = reader.result;
    this.loadServices();
  }

  addTags() {
    this.tags.push(this.text)
    this.text = null;
  }
  removeTags(index) {
    this.tags.splice(index, 1);
  }

  addFile($event) {
    if ($event.target.files[0].type.indexOf("image") < 0) {
      this.toaster.open(NoticyAlertComponent, { text: `danger-El archivo cargado no es una imagen.` });
      return;
    }
    this.img_files = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.img_files);
    reader.onloadend = () => this.img_previzualizar = reader.result;
  }

  addImages() {
    this.images_files.push({
      file: this.img_files,
      show: this.img_previzualizar,
    });
    this.img_files = null;
    this.img_previzualizar = null;
  }

  removeImages(index) {
    this.images_files.splice(index, 1);
  }

  createProduct() {

    if (!this.title ||
      !this.sku ||
      !this.proveedor_id ||
      !this.precioCompra ||
      !this.fechaCompra ||
      !this.categorie_id ||
      !this.price_soles ||
      !this.price_usd ||
      !this.resumen ||
      !this.stock_individual ||
      //!this.description ||
      !this.imagen_file) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-Todos los campos son obligatorios.` });
      return;
    }
    if (this.images_files.length == 0) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-Complete la galería de imagenes para continuar.` });
      return;
    }

    let formaData = new FormData();
    formaData.append("title", this.title)
    formaData.append("sku", this.sku)
    formaData.append("state", this.state)
    formaData.append("proveedor_id", this.proveedor_id)
    formaData.append("precioCompra", this.precioCompra)
    formaData.append("fechaCompra", this.fechaCompra)
    formaData.append("categorie_id", this.categorie_id)
    formaData.append("price_soles", this.price_soles)
    formaData.append("price_usd", this.price_usd)
    formaData.append("resumen", this.resumen)
    formaData.append("stock", this.stock_individual)
    formaData.append("description", this.description)
    formaData.append("imagen_file", this.imagen_file)
    formaData.append("tags", this.tags)

    let index = 0;
    for (const imagen of this.images_files) {
      formaData.append("files[" + index + "]", imagen.file);
      index++;
    }

    this._productService.createProduct(formaData).subscribe((resp: any) => {
      console.log(resp);
      this.toaster.open(NoticyAlertComponent, { text: `primary-El producto se registró exitosamente.` });
      this.title = null;
      this.sku = null;
      this.state = 0;
      this.proveedor_id = null;
      this.precioCompra = null;
      this.fechaCompra = null;
      this.categorie_id = null;
      this.price_soles = null;
      this.price_usd = null;
      this.resumen = null;
      this.stock_individual = null;
      this.description = null;
      this.imagen_file = null;
      this.imagen_previzualiza = null;
      this.tags = [];
      this.images_files = [];
    })
  }

  allProveedores() {
    this._proveedorService.allProveedores().subscribe((resp: any) => {
      console.log('Proveedores: ', resp);
      this.lstProveedores = resp.proveedores;
    
    })
  }
  

  volver() {

  }
}
