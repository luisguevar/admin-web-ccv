import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { URL_BACKEND } from 'src/app/config/config';
import { ClienteService } from '../_services/cliente.service';
import { AddClienteComponent } from '../add-cliente/add-cliente.component';
import { DeleteClienteComponent } from '../delete-cliente/delete-cliente.component';
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

  reset(){
    this.search = null;
    this.allClientes();
  }

  addCliente(){
    const modalRef = this.modelService.open(AddClienteComponent, {centered : true, size: 'lg'});
    modalRef.result.then(
      () => {

      },
      () => {
        
      }
    )
    modalRef.componentInstance.clientsE.subscribe((resp:any)=>{
      // console.log(resp);
      //this.clientes.unshift(resp);
      this.allClientes();
    });
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

  delete(cliente){
    const modalRef = this.modelService.open(DeleteClienteComponent, {centered : true, size: 'md'});
    modalRef.componentInstance.cliente_selected = cliente;
    modalRef.result.then(
      () => {

      },
      () => {
        
      }
    )
    modalRef.componentInstance.clientsE.subscribe((resp:any) => {
      let INDEX = this.clientes.findIndex(item => item.id == resp.id);
      this.clientes.splice(INDEX,1);
    })
  }
  

}
