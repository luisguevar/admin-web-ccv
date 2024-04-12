import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiciosGeneralService } from '../../servicios-general.service';
import { FormControl } from '@angular/forms';
import { URL_BACKEND } from 'src/app/config/config';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-add-edit-categoria',
  templateUrl: './add-edit-categoria.component.html',
  styleUrls: ['./add-edit-categoria.component.scss']
})
export class AddEditCategoriaComponent implements OnInit {

  isLoading$;
  isLoading: boolean = false;

  bEdit: boolean = false;
  cTitle: string = ''


  lstEstados = [

    { nIdEstado: 1, cEstado: 'Activo' },
    { nIdEstado: 0, cEstado: 'Inactivo' },
  ];

  //Formulario
  categoria_id: number = 0;
  descripcion: string = null;
  cboEstado: FormControl = new FormControl(1);
  icono: string = null;
  imagen_previzualiza: any = null;
  imagen_file: any = null;
  usuario_dni: any = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddEditCategoriaComponent>,
    public _service: ServiciosGeneralService,
    public toaster: Toaster,
    public authservice: AuthService
  ) {

    this.bEdit = this.data.bEdit;
    this.cTitle = this.data.cTitle;
    this.usuario_dni = this.authservice.user.cDocumento;
    console.log('user. ', this.authservice.user)

  }

  ngOnInit(): void {
    this.isLoading$ = this._service.isLoading$;
    if (this.bEdit) {
      this.SetearValores(this.data.categoria);
    }
  }

  SetearValores(categoria) {
    /* console.log('categoria: ', categoria); */
    this.categoria_id = categoria.id;
    this.descripcion = categoria.cDescripcion;
    this.cboEstado.setValue(categoria.nEstado);
    this.icono = categoria.cIcono;
    this.imagen_previzualiza = URL_BACKEND + 'storage/' + categoria.cImagen;
  }

  processFile($event) {
    if ($event.target.files[0].type.indexOf("image") < 0) {
      this.toaster.open(NoticyAlertComponent, { text: `danger-'El Archivo cargado no es una imagen'` });
      return;
    }
    this.imagen_file = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.imagen_file);
    reader.onloadend = () => this.imagen_previzualiza = reader.result;

  }

  BotonGuardarCategoria() {

    if (!this.descripcion || !this.icono || !this.imagen_file) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Complete todos los campos para continuar.'` });
      return;
    }


    let formData = new FormData();
    formData.append("imagen_file", this.imagen_file);
    formData.append("cDescripcion", this.descripcion);
    formData.append("nEstado", this.cboEstado.value);
    formData.append("cIcono", this.icono);

    formData.append("cUsuarioCreacion", this.usuario_dni);
    formData.append("cUsuarioModificacion", this.usuario_dni);
   

    this._service.PostCategoria(formData).subscribe((resp: any) => {
      /*   console.log('CREATE: ', resp); */

      if (resp.success) {

        this.toaster.open(NoticyAlertComponent, { text: `primary-'Categoría guardada correctamente'` });
        this.categoria_id = resp.categoria.id;
        this.bEdit = true;
        this.cTitle = 'Editar Categoría';
      } else {
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al guardar la Categoría.'` });
      }


    },
      (error: any) => {
        /* console.error('Error al guardar la categoría:', error); */
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al guardar la Categoría.'` });
        return;
      }


    )
  }

  BotonActualizarCategoria() {
    if (!this.descripcion || !this.icono ) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Complete todos los campos para continuar.'` });
      return;
    }
    
    let formData = new FormData();
    formData.append("imagen_file", this.imagen_file);
    formData.append("cDescripcion", this.descripcion);
    formData.append("nEstado", this.cboEstado.value);
    formData.append("cIcono", this.icono);
    formData.append("cUsuarioModificacion", this.usuario_dni);

    this._service.PutCategoria(this.categoria_id, formData).subscribe((resp: any) => {
      /* console.log('UPDATE: ', resp); */

      if (resp.success) {
        this.toaster.open(NoticyAlertComponent, { text: `success-'Categoría actualizada correctamente'` });
      } else {
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar la Categoría.'` });
      }


    },
      (error: any) => {
        /* console.error('Error al actualizar la categoría:', error); */
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar la Categoría.'` });
        return;
      }

    )
  }



}
