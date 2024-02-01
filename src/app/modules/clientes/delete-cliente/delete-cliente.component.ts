import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClienteService } from '../_services/cliente.service';
@Component({
  selector: 'app-delete-cliente',
  templateUrl: './delete-cliente.component.html',
  styleUrls: ['./delete-cliente.component.scss']
})
export class DeleteClienteComponent implements OnInit {

  @Input() cliente_selected:any = null;
  @Output() clientsE: EventEmitter<any> = new EventEmitter();
  
  isLoading$;
  isLoading = false;

  constructor(
    public _clienteService: ClienteService,
    public modal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._clienteService.isLoading$;
  }

  delete(){
    this._clienteService.deleteCliente(this.cliente_selected.id).subscribe((resp:any) => {
      console.log(resp);
      this.modal.close();
      this.clientsE.emit(this.cliente_selected);
    })
  }

}
