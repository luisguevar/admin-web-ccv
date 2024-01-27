import { Component, OnInit } from '@angular/core';
import { CotizacionService } from '../_service/cotizacion.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { URL_BACKEND } from 'src/app/config/config';
@Component({
  selector: 'app-list-cotizacion',
  templateUrl: './list-cotizacion.component.html',
  styleUrls: ['./list-cotizacion.component.scss']
})
export class ListCotizacionComponent implements OnInit {
  isLoading$;
  search: any = null;
  filteredCotizaciones : any = null;

  cotizaciones: any = [];
  URL_BACKEND: any = URL_BACKEND;

  constructor(
    public _CotizacionService: CotizacionService,
    public modelService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._CotizacionService.isLoading$;
    this.allCotizaciones();
  }

  allCotizaciones() {
    this._CotizacionService.allCotizaciones(1, this.search).subscribe((resp: any) => {
      console.log('Cotizaciones: ', resp);
      this.cotizaciones = resp.cotizaciones;
      this.filteredCotizaciones= resp.cotizaciones;
    })
  }

  buscarClientes() {
    // Filtra la lista completa de clientes según el término de búsqueda
    const cotizacionesFiltrados = this.cotizaciones.filter(cotizacion =>
      cotizacion.clienteName.toLowerCase().includes(this.search.toLowerCase())
    );
    // Asigna la lista filtrada a filteredClientes y luego aplica la paginación
    this.filteredCotizaciones = cotizacionesFiltrados;
    
  }

  reset() {

  }

}
