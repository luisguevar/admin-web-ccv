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

  @Input() cliente_selected: any;
  @Output() clientsE: EventEmitter<any> = new EventEmitter();
  isLoading$: any;
  isLoading: boolean = false;

  //Datos Cliente
  nombres: any = null;
  apellidos: any = null;
  correo: any = null;
  nroDocumento: any = null;
  contacto: any = null;
  tipoPersona: any = null;
  pais: any = null;
  departamento: any = null;
  direccion: any = null;
  observacion: any = null;


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


    this.contacto = this.cliente_selected.contacto;
    this.tipoPersona = this.cliente_selected.tipoPersona;
    this.pais = this.cliente_selected.pais;
    this.departamento = this.cliente_selected.departamento;
    this.direccion = this.cliente_selected.direccion;
    this.observacion = this.cliente_selected.observacion;
  }

  save() {


    let datacliente =
    {
      "nombres": this.nombres,
      "apellidos": this.apellidos,
      "correo": this.correo,
      "nroDocumento": this.nroDocumento,
      "estado": 1,
      "contacto": this.contacto,
      "tipoPersona": this.tipoPersona,
      "pais": this.pais,
      "departamento": this.departamento,
      "direccion": this.direccion,
      "observacion": this.observacion
    };

    this._clienteService.updateCliente(this.cliente_selected.id, datacliente).subscribe((resp: any) => {
      console.log(resp);
      this.toaster.open(NoticyAlertComponent, { text: `primary-'El cliente se ha editado correctamente.'` });
      this.clientsE.emit(resp.cliente);
      this.modal.close();
    })
  }

}
