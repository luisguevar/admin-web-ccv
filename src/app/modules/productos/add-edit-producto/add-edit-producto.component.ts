import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiciosGeneralService } from '../../servicios-general.service';
import { Toaster } from 'ngx-toast-notifications';
import { AuthService } from '../../auth';
import { FormControl } from '@angular/forms';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { ProveedorEntity } from 'src/app/Models/ProveedorEntity';

@Component({
  selector: 'app-add-edit-producto',
  templateUrl: './add-edit-producto.component.html',
  styleUrls: ['./add-edit-producto.component.scss']
})
export class AddEditProductoComponent implements OnInit {

  isLoading$;
  isLoading: boolean = false;

  bEdit: boolean = false;
  bReadOnly: boolean = false;
  cTitle: string = null;
  usuario_dni: any = '';



  itemProducto: any = null;
  categorias: any = [];
  proveedores: ProveedorEntity[] = [];

  imagen_file: any = null;
  imagen_previzualiza: any = null;
  images_files: any = [];
  img_files: any = null;
  img_previzualizar: any = null;



  //GENERAL
  cDescripcion: string = null;
  cboEstado: FormControl = new FormControl(1);
  categoria_id: number = 0;
  cSku: string = '';
  nPrecioPEN: number = 0;
  nPrecioUSD: number = 0;
  nStock: number = 0;

  //DETALLES
  cResumen: string = null;
  cDescripcionDetallada: string = null;

  //IMÁGENES
  cImagen: string = null;
  //PROVEEDOR
  proveedor_id: number = 0;
  nPrecioCompra: number = 0;
  dFechaCompra: any = null;

  //listas
  lstEstados = [

    { nIdEstado: 2, cEstado: 'Publicado' },
    { nIdEstado: 1, cEstado: 'Borrador' },
    { nIdEstado: 0, cEstado: 'Inactivo' },
  ];
  producto_id: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddEditProductoComponent>,
    public _service: ServiciosGeneralService,
    public toaster: Toaster,
    public authservice: AuthService

  ) {

    this.ListarCategorias();
    this.ListarProductos();
    this.cTitle = this.data.cTitle;
    this.bEdit = this.data.bEdit;
    if (this.bEdit) {
      this.itemProducto = this.data.itemProducto;
      /*  this.SetearValores(); */
      this.ObtenerProductoPorId(this.itemProducto.id);
    }
    this.usuario_dni = this.authservice.user.cDocumento;
    this.bReadOnly = this.data.bReadOnly;
  }

  ngOnInit(): void {
    this.isLoading$ = this._service.isLoading$;
  }

  ObtenerProductoPorId(id) {
    this._service.GetProductoPorId(id).subscribe((resp: any) => {
      console.log('producto: ', resp.product);
      this.itemProducto = resp.product;
      this.producto_id = this.itemProducto.id;
      this.cDescripcion = this.itemProducto.cDescripcion;
      this.cboEstado.setValue(this.itemProducto.nEstado);
      this.categoria_id = this.itemProducto.categoria_id;
      this.proveedor_id = this.itemProducto.proveedor_id;
      this.cSku = this.itemProducto.cSku;
      this.nPrecioPEN = this.itemProducto.nPrecioPEN;
      this.nPrecioUSD = this.itemProducto.nPrecioUSD;
      this.nStock = this.itemProducto.nStock;
      this.cResumen = this.itemProducto.cResumen;
      this.cDescripcionDetallada = this.itemProducto.cDescripcionDetallada;
      this.cImagen = this.itemProducto.cImagen;
      this.imagen_previzualiza = this.itemProducto.cImagen;
      this.images_files = this.itemProducto.images;
      this.nPrecioCompra = this.itemProducto.nPrecioCompra;
      this.dFechaCompra = this.itemProducto.dFechaCompra;
    })
  }

  /*  SetearValores() {
     console.log('itemProducto:', this.itemProducto);
 
   } */

  BotonActualizarProducto() {
    if (!this.cDescripcion || this.categoria_id == 0 || !this.cSku) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Complete todos los campos de 'GENERAL' para continuar.'` });
      return;
    }

    if (this.nPrecioPEN <= 0) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Ingrese un Precio en PEN válido para continuar.'` });
      return;
    }

    if (this.nPrecioUSD <= 0) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Ingrese un Precio en USD válido para continuar.'` });
      return;
    }

    if (this.nStock <= 0) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Ingrese un Stock válido para continuar.'` });
      return;
    }

    if (!this.cResumen || !this.cDescripcionDetallada) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Complete todos los campos de 'DETALLES' para continuar.'` });
      return;
    }

    /* if (!this.imagen_file) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Inserte una imagen para continuar.'` });
      return;
    } */

    if (!this.dFechaCompra) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Complete todos los campos de proveedor para continuar.'` });
      return;
    }


    if (this.nPrecioCompra <= 0) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Ingrese un Precio de compra válido para continuar.'` });
      return;
    }

    let formaData = new FormData();
    formaData.append("cDescripcion", this.cDescripcion)
    formaData.append("categoria_id", this.categoria_id.toString())
    formaData.append("proveedor_id", this.proveedor_id.toString())
    formaData.append("cSku", this.cSku)
    formaData.append("nPrecioPEN", this.nPrecioPEN.toString())
    formaData.append("nPrecioUSD", this.nPrecioUSD.toString())
    formaData.append("cResumen", this.cResumen)
    formaData.append("cDescripcionDetallada", this.cDescripcionDetallada)
    formaData.append("imagen_file", this.imagen_file)
    formaData.append("nStock", this.nStock.toString())
    formaData.append("nPrecioCompra", this.nPrecioCompra.toString())
    formaData.append("dFechaCompra", this.dFechaCompra)
    formaData.append("cUsuarioModificacion", this.usuario_dni)
    formaData.append("nEstado", this.cboEstado.value)

    let index = 0;
    for (const imagen of this.images_files) {
      formaData.append("files[" + index + "]", imagen.file);
      index++;
    }

    console.log('imagenes:', this.images_files)
    this._service.PutProducto(this.producto_id, formaData).subscribe((resp: any) => {
      console.log(resp);
      if (resp.success) {
        this.toaster.open(NoticyAlertComponent, { text: `success-'Producto actualizado correctamente'` });
        this.ObtenerProductoPorId(this.producto_id);
      } else {
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar el Producto.'` });
      }
    },
      (error: any) => {
        console.log(error);
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar el Producto.'` });
        return;
      }


    )

  }


  BotonGuardarProducto() {

    if (!this.cDescripcion || this.categoria_id == 0 || !this.cSku) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Complete todos los campos de 'GENERAL' para continuar.'` });
      return;
    }

    if (this.nPrecioPEN <= 0) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Ingrese un Precio en PEN válido para continuar.'` });
      return;
    }

    if (this.nPrecioUSD <= 0) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Ingrese un Precio en USD válido para continuar.'` });
      return;
    }

    if (this.nStock <= 0) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Ingrese un Stock válido para continuar.'` });
      return;
    }

    if (!this.cResumen || !this.cDescripcionDetallada) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Complete todos los campos de 'DETALLES' para continuar.'` });
      return;
    }

    if (!this.imagen_file) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Inserte una imagen para continuar.'` });
      return;
    }

    if (!this.dFechaCompra) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Complete todos los campos de proveedor para continuar.'` });
      return;
    }


    if (this.nPrecioCompra <= 0) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Ingrese un Precio de compra válido para continuar.'` });
      return;
    }



    if (this.images_files.length == 0) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-Complete la galería de imagenes para continuar.` });
      return;
    }

    let formaData = new FormData();
    formaData.append("cDescripcion", this.cDescripcion)
    formaData.append("categoria_id", this.categoria_id.toString())
    formaData.append("proveedor_id", this.proveedor_id.toString())
    formaData.append("cSku", this.cSku)
    formaData.append("nPrecioPEN", this.nPrecioPEN.toString())
    formaData.append("nPrecioUSD", this.nPrecioUSD.toString())
    formaData.append("cResumen", this.cResumen)
    formaData.append("cDescripcionDetallada", this.cDescripcionDetallada)
    formaData.append("imagen_file", this.imagen_file)
    formaData.append("nStock", this.nStock.toString())
    formaData.append("nPrecioCompra", this.nPrecioCompra.toString())
    formaData.append("dFechaCompra", this.dFechaCompra)
    formaData.append("cUsuarioCreacion", this.usuario_dni)
    formaData.append("cUsuarioModificacion", this.usuario_dni)
    formaData.append("nEstado", this.cboEstado.value)


    let index = 0;
    for (const imagen of this.images_files) {
      formaData.append("files[" + index + "]", imagen.file);
      index++;
    }

    this._service.PostProducto(formaData).subscribe((resp: any) => {
      console.log(resp);
      console.log(resp);
      if (resp.success) {
        this.toaster.open(NoticyAlertComponent, { text: `primary-El producto se registró exitosamente.` });

        this.producto_id = resp.producto.id;
        this.ObtenerProductoPorId(this.producto_id);
        this.bEdit = true;
      } else {
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al registrar el Producto.'` });
      }
    },
      (error: any) => {
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al registrar el Producto.'` });
        return;
      }
    )
  }

  public ListarCategorias() {
    this._service.GetCategorias(1).subscribe((resp: any) => {
      this.categorias = resp.categorias;
    })
  }

  ListarProductos() {
    this._service.GetProveedores(1).subscribe((resp: any) => {
      this.proveedores = resp.proveedores;
    })
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

  loadServices() {
    this._service.isLoadingSubject.next(true);
    setTimeout(() => {
      this._service.isLoadingSubject.next(false)
    }, 50);
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
    if (!this.img_files) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-Inserte una imagen para continuar` });
      return;
    }

    if (this.bEdit) {
      let formaData = new FormData();
      formaData.append("product_id", this.producto_id.toString());
      formaData.append("file", this.img_files)
      this._service.addImagenProduct(formaData).subscribe((resp: any) => {
        this.img_files = null;
        this.img_previzualizar = null;
        this.images_files.unshift(resp.imagen);
      })
    } else {
      this.images_files.push({
        id: 0,
        file: this.img_files,
        imagen: this.img_previzualizar, // Agregar la vista previa de la imagen
        file_name: this.img_files.name // Suponiendo que quieres mostrar el nombre del archivo
      });
      this.img_files = null;
      this.img_previzualizar = null;
    }

  }


  removeImages(index) {

    if (this.bEdit) {
      this._service.deleteImagenProduct(index.id).subscribe((resp: any) => {
        this.images_files.splice(index, 1);
      })
    } else {
      this.images_files.splice(index, 1);
    }



  }

}
