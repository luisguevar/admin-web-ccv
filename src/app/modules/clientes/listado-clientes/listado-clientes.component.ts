import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ServiciosGeneralService } from '../../servicios-general.service';
import { Toaster } from 'ngx-toast-notifications';

@Component({
  selector: 'app-listado-clientes',
  templateUrl: './listado-clientes.component.html',
  styleUrls: ['./listado-clientes.component.scss']
})
export class ListadoClientesComponent implements OnInit {

  isLoading$;
  isLoading = false;

  totalPages = 1;
  currentPage = 1;

  state: any = 1;
  search: any = '';


  //paginacion
  pageSize = 5;
  desde: number = 0;
  hasta: number = 5;

  cboEstado: FormControl = new FormControl(-1);
  //listas
  lstEstados = [
    { nIdEstado: -1, cEstado: 'Todos' },
    { nIdEstado: 1, cEstado: 'Activo' },
    { nIdEstado: 0, cEstado: 'Inactivo' },
  ];
  filteredClientes: any = [];
  clientes: any;


  constructor(
    private _dialog: MatDialog,
    public _service: ServiciosGeneralService,
    public toaster: Toaster,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._service.isLoading$;
    this.BotonListarClientes();
  }

  public BotonListarClientes() {

  }

  public BotonNuevoCliente() {

  }

  public BotonEditarCliente(cliente) {

  }

  public BotonRemoverCliente(cliente) {

  }

  buscarClientes() {
    // Filtra la lista completa de clientes según el término de búsqueda
    const usuariosFiltrados = this.clientes.filter(user =>
      user.cNombres.toLowerCase().includes(this.search.toLowerCase()) ||
      user.cApellidos.toLowerCase().includes(this.search.toLowerCase()) ||
      user.cCorreo.toLowerCase().includes(this.search.toLowerCase())
    );

    // Asigna la lista filtrada a filteredClientes y luego aplica la paginación
    this.filteredClientes = usuariosFiltrados;
    this.desde = 0;  // Reinicia la paginación a la primera página
    this.hasta = this.pageSize;
  }
  cambiarPagina(e: PageEvent) {
    /*   console.log(e); */
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }

}
