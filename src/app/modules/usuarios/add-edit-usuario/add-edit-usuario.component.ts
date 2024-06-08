import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiciosGeneralService } from '../../servicios-general.service';
import { Toaster } from 'ngx-toast-notifications';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-add-edit-usuario',
  templateUrl: './add-edit-usuario.component.html',
  styleUrls: ['./add-edit-usuario.component.scss']
})
export class AddEditUsuarioComponent implements OnInit {

  isLoading$;
  isLoading: boolean = false;

  bEdit: boolean = false;
  cTitle: string = ''

  lstEstados = [

    { nIdEstado: 1, cEstado: 'Activo' },
    { nIdEstado: 0, cEstado: 'Inactivo' },
  ];

  lstRoles = [

    { nIdRol: 0, cRol: 'Ninguno' },
    { nIdRol: 1, cRol: 'Usuario Administrador' },
  ];

  //campos
  usuario_id: number = 0;
  name: string = null;
  surname: string = null;
  /*  email: string = null; */
  documentIdentity: string = null;
  role_id: number = 0;
  /*   password: string = null;
    rpassword: string = null; */
  cboRol: FormControl = new FormControl(0);
  cboEstado: FormControl = new FormControl(1);

  myForm: FormGroup;
  usuario_dni: string = '';

  bBloqueo:boolean = false;

  constructor(

    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddEditUsuarioComponent>,
    public _service: ServiciosGeneralService,
    public toaster: Toaster,
    public fb: FormBuilder,
    public authservice: AuthService
  ) {

    this.usuario_dni = this.authservice.user.cDocumento;
    this.bEdit = this.data.bEdit;
    this.cTitle = this.data.cTitle;
    this.bBloqueo = this.data.bMismoUsuario;
    this.myForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      repetPassword: [null, [Validators.required, Validators.minLength(6)]],
    }, { validator: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password').value;
    const repeatPassword = formGroup.get('repetPassword').value;

    if (password !== repeatPassword) {
      formGroup.get('repetPassword').setErrors({ mismatch: true });
    } else {
      formGroup.get('repetPassword').setErrors(null);
    }
  }

  ngOnInit(): void {

    this.isLoading$ = this._service.isLoading$;
    if (this.bEdit) {
      this.SetearValores(this.data.usuario);
    }

  }

  get f() { return this.myForm.controls; }

  SetearValores(usuario) {
    console.log('usuario: ', usuario);
    this.usuario_id = usuario.id;
    this.name = usuario.cNombres;
    this.f.email.setValue(usuario.email);
    this.surname = usuario.cApellidos;
    this.documentIdentity = usuario.cDocumento;
    this.cboRol.setValue(usuario.nRol);
    this.cboEstado.setValue(usuario.nEstado);

  }


  BotonGuardarUsuarios() {

    if (!this.name || !this.surname || !this.f.email.value || !this.documentIdentity || !this.f.password.value || !this.f.repetPassword.value) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Complete todos los campos para continuar.'` });
      return;
    }

    if (this.f.password.value != this.f.repetPassword.value) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Las contraseñas no coinciden.'` });
      return;
    }

    const data = {

      'role_id': this.cboRol.value,
      'type_user': 2,
      'state': 1,

      'cNombres': this.name,
      'cApellidos': this.surname,
      'cDocumento': this.documentIdentity,
      'nTipoUsuario': 2,
      'nRol': this.cboRol.value,
      'nEstado': this.cboEstado.value,

      'name': this.name,
      'email': this.f.email.value,
      'surname': this.surname,
      'password': this.f.password.value,
      'cUsuarioCreacion': this.usuario_dni,
      'cUsuarioModificacion': this.usuario_dni

    }

    console.log('data: ', data);
    this._service.PostUsuarios(data).subscribe((resp: any) => {
      /* console.log('CREATE: ', resp); */

      if (resp.success) {

        this.toaster.open(NoticyAlertComponent, { text: `primary-'Usuario guardado correctamente'` });
        this.usuario_id = resp.usuario.id;
        this.bEdit = true;
        this.cTitle = 'Editar Usuario';
      } else {
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al guardar el Usuario.'` });
      }


    },
      (error: any) => {

        console.log(error);
        if (error.status === 400 && error.error.message) {
          let messages = '';

          this.toaster.open(NoticyAlertComponent, { text: `danger-'${error.error.message}'` });
        } else {
          this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al guardar el Usuario.'` });
        }
      }


    )
  }

  BotonActualizarUsuario() {
    if (!this.name || !this.surname || !this.documentIdentity) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Complete todos los campos para continuar.'` });
      return;
    }
    const data = {

      'role_id': this.cboRol.value,
      'type_user': 2,
      'state': 1,

      'cNombres': this.name,
      'cApellidos': this.surname,
      'cDocumento': this.documentIdentity,
      'nTipoUsuario': 2,
      'nRol': this.cboRol.value,
      'nEstado': this.cboEstado.value,

      'name': this.name,
      'email': this.f.email.value,
      'surname': this.surname,
      'cUsuarioModificacion': this.usuario_dni
    }
    console.log('data: ', data);
    this._service.PutUsuarios(this.usuario_id, data).subscribe((resp: any) => {
      /*   console.log('CREATE: ', resp); */

      if (resp.success) {

        this.toaster.open(NoticyAlertComponent, { text: `success-'Usuario actualizado correctamente'` });

      } else {
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar el Usuario.'` });
      }


    },
      (error: any) => {
        console.log(error);
        if (error.status === 400 && error.error.message) {


          this.toaster.open(NoticyAlertComponent, { text: `danger-'${error.error.message}'` });
        } else {
          this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al actualizar el Usuario.'` });
        }
      }


    )
  }
}
