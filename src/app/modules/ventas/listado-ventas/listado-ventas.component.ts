import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ServiciosGeneralService } from '../../servicios-general.service';
import { VentaEntity } from 'src/app/Models/VentaEntity';
import { PageEvent } from '@angular/material/paginator';
import { PuntoVentaComponent } from '../punto-venta/punto-venta.component';

@Component({
  selector: 'app-listado-ventas',
  templateUrl: './listado-ventas.component.html',
  styleUrls: ['./listado-ventas.component.scss']
})
export class ListadoVentasComponent implements OnInit {

  @ViewChild(PuntoVentaComponent, { static: false })
  child: PuntoVentaComponent;

  isLoading$;

  txtcCorrelativo: FormControl = new FormControl(null);
  txtDniCliente: FormControl = new FormControl(null);
  txtDniVendedor: FormControl = new FormControl(null);
  cboEstado: FormControl = new FormControl(-1);
  startDate: FormControl = new FormControl(null);
  endDate: FormControl = new FormControl(null);

  ventas: VentaEntity[] = [];

  //listas
  lstEstados = [
    { nIdEstado: -1, cEstado: 'Todos' },
    { nIdEstado: 1, cEstado: 'Registrado' },
    { nIdEstado: 2, cEstado: 'Enviado' },
    { nIdEstado: 3, cEstado: 'Rechazado' },
    { nIdEstado: 0, cEstado: 'Inactivo' },
  ];

  pageSize = 5;
  desde: number = 0;
  hasta: number = 5;

  bDetalleVenta: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public _service: ServiciosGeneralService,
  ) {
    const correlativo = this.route.snapshot.paramMap.get('correlativo');

    if (correlativo != 'ventas') {
      this.txtcCorrelativo.setValue(correlativo);
    }
  }

  ngOnInit(): void {
    this.isLoading$ = this._service.isLoading$;
    this.BotonListarVentas();
  }

  BotonListarVentas() {
    this._service.GetVentas(
      this.cboEstado.value,
      this.txtcCorrelativo.value,
      this.startDate.value,
      this.endDate.value

    ).subscribe((resp: any) => {

      console.log(resp);
      if (resp.ventas) {
        this.ventas = resp.ventas;
        console.log('ventas:', this.ventas);
      }
      /*  this.cotizaciones = resp.cotizaciones;
       this.filteredCotizaciones = [...this.cotizaciones]; */
    })
  }
  cambiarPagina(e: PageEvent) {
    /*   console.log(e); */
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }


  BotonLimpiarFiltros() {
    this.txtcCorrelativo.setValue(null);
    this.txtDniCliente.setValue(null);
    this.txtDniVendedor.setValue(null);
    this.cboEstado.setValue(-1);
    this.startDate.setValue(null);
    this.endDate.setValue(null);
  }

  BotonRegistrarPuntoVenta() {

  }

  BotonVisualizarVenta(id: number) {

    this.bDetalleVenta = true;
    setTimeout(() => {
      this.child.ObtenerVentaPorId(id);
    }, 10);
  }
}
