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

  }


  delete() {

    this.proveedorE.emit(true);
    this.modal.close();
  }



}
