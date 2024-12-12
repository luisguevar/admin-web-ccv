import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiciosGeneralService } from '../../servicios-general.service';
import { Toaster } from 'ngx-toast-notifications';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { ClienteEntity } from 'src/app/Models/ClienteEntity';
import { VentaEntity } from 'src/app/Models/VentaEntity';
import { CotizacionEntity } from 'src/app/Models/CotizacionEntity';

@Component({
  selector: 'app-show-cliente',
  templateUrl: './show-cliente.component.html',
  styleUrls: ['./show-cliente.component.scss']
})
export class ShowClienteComponent implements OnInit {
  isLoading$;
  isLoading: boolean = false;
  usuario_dni:string = ""
  cliente:ClienteEntity = null
  cTitle:string = ""
  avatar:string = "";
  listVentas:VentaEntity[] = [] ;
  listCotizaciones:CotizacionEntity[] = [] ; 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ShowClienteComponent>,
    public _service: ServiciosGeneralService,
    public toaster: Toaster,
    public fb: FormBuilder,
    public authservice: AuthService) 
    {
    this.usuario_dni = this.authservice.user.cDocumento;
    this.cliente = this.data.cliente;
    this.cTitle = this.data.cTitle;
    }

  ngOnInit(): void {
    this.isLoading$ = this._service.isLoading$;
    console.log(this.cliente);
    setTimeout(() => {
      this.ObtenerClientePorId (this.cliente.id)
    }, 10);
    
  }


  public ObtenerClientePorId(id: number) {

    this._service.GetClientePorId(id).subscribe((resp: any) => {
      console.log('cliente: ', resp);
      this.avatar = resp.cAvatar;
      this.listVentas = resp.ListVentas;
      this.listCotizaciones = resp.ListCotizaciones;
     


    })
  }



}
