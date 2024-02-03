import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { ClienteService } from '../_services/cliente.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-cliente',
  templateUrl: './add-cliente.component.html',
  styleUrls: ['./add-cliente.component.scss']
})
export class AddClienteComponent implements OnInit {

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
  lstPaises: any = [];

  cboPais = new FormControl();
  cboDepartamento = new FormControl();
  lstDepartamentos: any = [];

  constructor(
    public _clienteService: ClienteService,
    public modal: NgbActiveModal,
    public toaster: Toaster,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._clienteService.isLoading$;


    setTimeout(() => {
      this.getPaises();
      this.getDepartamento(89);
      this.cboDepartamento.setValue(this.lstDepartamentos[0]);
    }, 10);

    this.cboPais.valueChanges.subscribe(value => {
      this.getDepartamento(value);
    });

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
      "pais": this.cboPais.value,
      "departamento": this.cboDepartamento.value,
      "direccion": this.direccion,
      "observacion": this.observacion
    };



    this._clienteService.createCliente(datacliente).subscribe((resp: any) => {
      console.log(resp);
      this.clientsE.emit(resp.categorie);
      this.toaster.open(NoticyAlertComponent, { text: `primary-'EL CLIENTE SE A REGISTRADO DE MANERA CORRECTA.'` });
      this.modal.close();
    })
  }

  getPaises() {
    this._clienteService.getPaises().subscribe((resp: any) => {
      console.log(resp);
      this.lstPaises = resp.paises;
      this.cboPais.setValue(89); //perú

    })
  }
  getDepartamento(idPais: number) {
    this._clienteService.getDepartamento(idPais).subscribe((resp: any) => {
      console.log(resp);
      this.lstDepartamentos = resp.ciudades;
      this.cboDepartamento.setValue(this.lstDepartamentos[0]); //Amazonas

    })
  }


}
