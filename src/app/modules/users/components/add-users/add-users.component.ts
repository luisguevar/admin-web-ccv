import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { UsersService } from '../../_services/users.service';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {

  @Output() usersE: EventEmitter<any> = new EventEmitter();

  isLoading$;
  isLoading = false;

  formGroup: FormGroup;

  constructor(
    public fb: FormBuilder,
    public _userService: UsersService,
    public modal: NgbActiveModal,
    public toaster: Toaster,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._userService.isLoading$;
    this.loadForm();
  }
  loadForm() {
    this.formGroup = this.fb.group({
      name: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      surname: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.maxLength(249),
        ])
      ],
      type_user: [2],
      role_id: ['1'],
      password: [null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(249),
        ])],
      rpassword: [null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(249),
        ])]
    });
  }

  save() {
    if (this.formGroup.value.password != this.formGroup.value.rpassword) {
      // alert("NECESITAS DIGITAR IGUAL LAS CONTRASEÑAS");
      this.toaster.open(NoticyAlertComponent, { text: `danger- Las contraseñas no son iguales.` });
      return;
    }
    this._userService.register(this.formGroup.value).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 400) {
        this.toaster.open(NoticyAlertComponent, { text: `warning- El usuario ya existe.` });
        return;
      } else {
        this.toaster.open(NoticyAlertComponent, { text: `primary-Usuario creado éxitosamente` });
        this.modal.close();
        this.usersE.emit(resp.user);
        return;
      }
    })
  }
  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
