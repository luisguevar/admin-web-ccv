import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CotizacionService } from '../_service/cotizacion.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { URL_BACKEND } from 'src/app/config/config';
import { PageEvent } from '@angular/material/paginator';
import { DeleteCotizacionComponent } from '../delete-cotizacion/delete-cotizacion.component';
@Component({
  selector: 'app-list-cotizacion',
  templateUrl: './list-cotizacion.component.html',
  styleUrls: ['./list-cotizacion.component.scss']
})
export class ListCotizacionComponent implements OnInit {
  isLoading$;
  search: any = null;
  filteredCotizaciones: any = [];

  cotizaciones: any = [];
  URL_BACKEND: any = URL_BACKEND;

  //paginacion
  pageSize = 5;
  desde: number = 0;
  hasta: number = 5;

  estadoCotizacion: any = 0;

  constructor(
    public _CotizacionService: CotizacionService,
    public modelService: NgbModal,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._CotizacionService.isLoading$;
    this.allCotizaciones(this.estadoCotizacion);
  }

  allCotizaciones(estadoCotizacion: any) {
    this._CotizacionService.allCotizaciones(estadoCotizacion).subscribe((resp: any) => {
      console.log('Cotizaciones: ', resp);
      this.cotizaciones = resp.cotizaciones;
      this.filteredCotizaciones = resp.cotizaciones;
    })
  }
  listarCotizaciones() {
    this.allCotizaciones(this.estadoCotizacion);
  }

  buscarClientes() {
    // Filtra la lista completa de clientes según el término de búsqueda
    const cotizacionesFiltrados = this.cotizaciones.filter(cotizacion =>
      cotizacion.clienteName.toLowerCase().includes(this.search.toLowerCase())
    );
    // Asigna la lista filtrada a filteredClientes y luego aplica la paginación
    this.filteredCotizaciones = cotizacionesFiltrados;

    this.desde = 0;  // Reinicia la paginación a la primera página
    this.hasta = this.pageSize;
  }

  cambiarPagina(e: PageEvent) {
    console.log(e);
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }

  reset() {
    this.search = null;
    this.estadoCotizacion = 0;
    this.allCotizaciones(0);
  }

  delete(cotizacion) {
    const modalRef = this.modelService.open(DeleteCotizacionComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.cotizacion_selected = cotizacion;
    modalRef.componentInstance.cotizacionE.subscribe((resp: any) => {
      console.log('eliminación: ', resp);
      this.listarCotizaciones();
      this.cdr.detectChanges(); // Forzar la detección de cambios

    })

  }

}
