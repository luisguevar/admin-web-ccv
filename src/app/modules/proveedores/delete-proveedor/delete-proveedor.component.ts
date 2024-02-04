import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CotizacionService } from '../../cotizaciones/_service/cotizacion.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { ProveedorService } from '../_service/proveedor.service';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-delete-proveedor',
  templateUrl: './delete-proveedor.component.html',
  styleUrls: ['./delete-proveedor.component.scss']
})
export class DeleteProveedorComponent implements OnInit {

  @Input() proveedor_selected: any = null;
  @Output() proveedorE: EventEmitter<any> = new EventEmitter();

  isLoading$;
  isLoading = false;

  constructor(
    public _proveedorService: ProveedorService,
    public modal: NgbActiveModal,
    public toaster: Toaster,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._proveedorService.isLoading$;
    console.log('proveedor_selected: ', this.proveedor_selected);
  }



  delete() {
    let dataProveedor = {
      id: this.proveedor_selected.id
    }

     this.update(dataProveedor);
  }

  update(dataProveedor: any) {

    this._proveedorService.removeProveedor(dataProveedor).subscribe(
      (resp: any) => {
        console.log('Respuesta:', resp);

        if (resp.success) {

          this.toaster.open(NoticyAlertComponent, { text: `info-El proveedor se removió exitosamente.` });
          this.modal.close();
          this.proveedorE.emit(resp);
          return;
        }
      },
      (error: any) => {
        console.error('Error al actualizar el proveedor:', error);
        this.toaster.open(NoticyAlertComponent, { text: `danger-Ocurrió un error al eliminar el proveedor.` });
        return;
      }
    )


  }

}
