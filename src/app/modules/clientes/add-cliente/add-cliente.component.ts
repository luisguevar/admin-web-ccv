import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { ClienteService } from '../_services/cliente.service';

@Component({
  selector: 'app-add-cliente',
  templateUrl: './add-cliente.component.html',
  styleUrls: ['./add-cliente.component.scss']
})
export class AddClienteComponent implements OnInit {

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
  }

  

  save(){
    

    let datacliente = 
    {
      "nombres" : this.nombres,
      "apellidos" : this.apellidos,
      "correo": this.correo,
      "nroDocumento":this.nroDocumento,
      "estado" : 1
    };

    
    
    this._clienteService.createCliente(datacliente).subscribe((resp:any) => {
      console.log(resp);
      this.clientsE.emit(resp.categorie);
      this.toaster.open(NoticyAlertComponent,{text:`primary-'EL CLIENTE SE A REGISTRADO DE MANERA CORRECTA.'`});
      this.modal.close();
    })
  }

}
