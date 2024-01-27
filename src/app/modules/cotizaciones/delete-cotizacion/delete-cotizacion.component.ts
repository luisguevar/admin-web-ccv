import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CotizacionService } from '../_service/cotizacion.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-delete-cotizacion',
  templateUrl: './delete-cotizacion.component.html',
  styleUrls: ['./delete-cotizacion.component.scss']
})
export class DeleteCotizacionComponent implements OnInit {

  @Input() cotizacion_selected: any = null;
  @Output() cotizacionE: EventEmitter<any> = new EventEmitter();

  isLoading$;
  isLoading = false;

  constructor(
    public _cotizacionService: CotizacionService,
    public modal: NgbActiveModal,
    public toaster: Toaster,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._cotizacionService.isLoading$;
    console.log('cotizacion_selected: ', this.cotizacion_selected);
  }



  delete() {
    let dataCotizacion = {
      id: this.cotizacion_selected.id
    }

    this.update(dataCotizacion);
  }

  update(dataCotizacion: any) {

    this._cotizacionService.removeCotizacion(dataCotizacion).subscribe(
      (resp: any) => {
        console.log('Respuesta:', resp);

        if (resp.success) {

          this.toaster.open(NoticyAlertComponent, { text: `primary-'Cotizacion eliminada correctamente'` });
          this.modal.close();
          this.cotizacionE.emit(resp);
          return;
        }
      },
      (error: any) => {
        console.error('Error al actualizar el proveedor:', error);
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al eliminar la Cotizacion.'` });
        return;
      }
    )


  }
}
