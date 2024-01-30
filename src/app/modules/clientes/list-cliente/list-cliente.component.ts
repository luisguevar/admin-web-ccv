import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { URL_BACKEND } from 'src/app/config/config';
import { ClienteService } from '../_services/cliente.service';
import { EditClienteComponent } from '../edit-cliente/edit-cliente.component';

@Component({
  selector: 'app-list-cliente',
  templateUrl: './list-cliente.component.html',
  styleUrls: ['./list-cliente.component.scss']
})
export class ListClienteComponent implements OnInit {
  
  isLoading$;
  search:any = null;
  
  clientes:any = [];
  URL_BACKEND:any = URL_BACKEND;

  constructor(
    public _clienteService: ClienteService,
    public modelService: NgbModal,) {}

  ngOnInit(): void {
    this.isLoading$ = this._clienteService.isLoading$;
    this.allClientes();
  }

  allClientes(){
    this._clienteService.allClientes(1,this.search).subscribe((resp:any)=>{
      console.log(resp);
      this.clientes = resp.clientes;
    })
  }

  edit(cliente){
    console.log(cliente)
    const modalRef = this.modelService.open(EditClienteComponent, {centered : true, size: 'lg'});
    modalRef.componentInstance.cliente_selected = cliente;
    modalRef.result.then(
      () => {

      },
      () => {
        
      }
    )
    modalRef.componentInstance.clientsE.subscribe((resp:any) => {
      let INDEX = this.clientes.findIndex(item => item.id == resp.id);
      this.clientes[INDEX] = resp;
    })
  }
  

}
