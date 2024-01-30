import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { URL_BACKEND } from 'src/app/config/config';
import { ClienteService } from '../_services/cliente.service';

@Component({
  selector: 'app-edit-cliente',
  templateUrl: './edit-cliente.component.html',
  styleUrls: ['./edit-cliente.component.scss']
})
export class EditClienteComponent implements OnInit {

  @Input() cliente_selected:any;
  @Output() clientsE: EventEmitter<any> = new EventEmitter();
  isLoading$:any;
  isLoading:boolean = false;

  //Datos Cliente
  nombres:any = null;
  apellidos:any = null;
  correo:any = null;
  nroDocumento:any = null;

  constructor(
    public _clienteService: ClienteService,
    public modal: NgbActiveModal,
    public toaster: Toaster,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._clienteService.isLoading$;
    console.log(this.cliente_selected);
    this.nombres = this.cliente_selected.nombres;
    this.apellidos = this.cliente_selected.apellidos;
    this.correo = this.cliente_selected.correo;
    this.nroDocumento = this.cliente_selected.nroDocumento;
    
  }

  save(){
    let formData = new FormData();
    
    formData.append("nombres",this.nombres);
    formData.append("apellidos",this.apellidos);
    formData.append("correo",this.correo);
    formData.append("nroDocumento",this.nroDocumento);

    this._clienteService.updateCliente(this.cliente_selected.id,formData).subscribe((resp:any) => {
      console.log(resp);
      this.toaster.open(NoticyAlertComponent,{text:`primary-'EL CLIENTE SE  A EDITADO DE MANERA CORRECTA.'`});
      this.clientsE.emit(resp.cliente);
      this.modal.close();
    })
  }

}
