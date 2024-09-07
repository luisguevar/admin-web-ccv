import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { ServiciosGeneralService } from '../../servicios-general.service';
import { VentaEntity } from 'src/app/Models/VentaEntity';

@Component({
  selector: 'app-confirmador-eliminador-observacion',
  templateUrl: './confirmador-eliminador-observacion.component.html',
  styleUrls: ['./confirmador-eliminador-observacion.component.scss']
})
export class ConfirmadorEliminadorObservacionComponent implements OnInit {

  cObservaciones: string = null;
  cTitle: string = null;
  id: number = 0;
  constructor(public dialogRef: MatDialogRef<ConfirmadorEliminadorObservacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toaster: Toaster,
    public _service: ServiciosGeneralService,
  ) {
    this.cTitle = this.data.cTitle;
    this.id = this.data.id;

  }

  ngOnInit(): void {
  }

  Guardar() {

    if (!this.cObservaciones) {
      this.toaster.open(NoticyAlertComponent, { text: `warning-'Ingrese una observación para continuar.'` });
      return;
    }

    const venta = new VentaEntity();
    venta.id = this.id;
    venta.nEstado = 5;
    venta.cObservaciones = this.cObservaciones;
    

    this._service.PutCancelarVenta(this.id, venta).subscribe((resp: any) => {
      console.log(resp);
      if (resp.success) {

        this.toaster.open(NoticyAlertComponent, { text: `success-'Pedido cancelado correctamente'` });
        this.dialogRef.close(true);


      } else {
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al cancelar el Pedido.'` });
      }
    },
      (error: any) => {
        console.log(error);
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al cancelar el Pedido.'` });
        return;
      }

    )


  }

}
