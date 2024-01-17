import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { CotizacionService } from '../_service/cotizacion.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-add-dialog-cliente',
  templateUrl: './add-dialog-cliente.component.html',
  styleUrls: ['./add-dialog-cliente.component.scss']
})
export class AddDialogClienteComponent implements OnInit {
  @Output() clienteE: EventEmitter<any> = new EventEmitter();

  //paginacion
  pageSize = 3;
  desde: number = 0;
  hasta: number = 3;

  listClientes: any = [];
  filteredClientes: any = [];

  search: string = '';

  constructor(
    public toaster: Toaster,
    public _CotizacionService: CotizacionService,
    public modelService: NgbModal,
    public modal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.allClientes();
    }, 10);
  }

  allClientes() {
    this._CotizacionService.allClientes().subscribe((resp: any) => {
      console.log('Clientes: ', resp);
      this.listClientes = resp.clientes;
      // Inicializa los clientes filtrados con la lista completa al principio
      this.filteredClientes = [...this.listClientes];
    });
  }

  cambiarPagina(e: PageEvent) {
    console.log(e);
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }

  buscarClientes() {
    // Filtra la lista completa de clientes según el término de búsqueda
    const clientesFiltrados = this.listClientes.filter(cliente =>
      cliente.nombres.toLowerCase().includes(this.search.toLowerCase()) ||
      cliente.apellidos.toLowerCase().includes(this.search.toLowerCase())
    );

    // Asigna la lista filtrada a filteredClientes y luego aplica la paginación
    this.filteredClientes = clientesFiltrados;
    this.desde = 0;  // Reinicia la paginación a la primera página
    this.hasta = this.pageSize;
  }

  seleccionarCliente(cliente: any) {
    this.modal.close();
    this.clienteE.emit(cliente);
    return;
  }

  reset() {
    this.allClientes();
    this.search = null;
  }
}
