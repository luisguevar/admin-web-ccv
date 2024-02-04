import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProveedorService } from '../_service/proveedor.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { URL_BACKEND } from 'src/app/config/config';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { PageEvent } from '@angular/material/paginator';
import { DeleteProveedorComponent } from '../delete-proveedor/delete-proveedor.component';

@Component({
  selector: 'app-list-proveedor',
  templateUrl: './list-proveedor.component.html',
  styleUrls: ['./list-proveedor.component.scss']
})
export class ListProveedorComponent implements OnInit {
  isLoading$;
  search: any = null;

  proveedores: any = [];
  URL_BACKEND: any = URL_BACKEND;

  filteredProveedores: any = [];
  //paginacion
  pageSize = 5;
  desde: number = 0;
  hasta: number = 5;

  constructor(
    public _proveedorService: ProveedorService,
    public modelService: NgbModal,
    public toaster: Toaster,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    /*   this.spinnerService.startSpinner(); */
    this.isLoading$ = this._proveedorService.isLoading$;
    this.allProveedores();
  }

  allProveedores() {

    this._proveedorService.allProveedores(1, this.search).subscribe((resp: any) => {
      console.log('Proveedores: ', resp);
      this.proveedores = resp.proveedores;
      this.filteredProveedores = [...this.proveedores];
    })
  }

  buscarProveedores() {
    // Filtra la lista completa de clientes según el término de búsqueda
    const proveedoresFiltrados = this.proveedores.filter(proveedor =>
      proveedor.razon_social.toLowerCase().includes(this.search.toLowerCase())
    );



    // Asigna la lista filtrada a filteredClientes y luego aplica la paginación
    this.filteredProveedores = proveedoresFiltrados;
    this.desde = 0;  // Reinicia la paginación a la primera página
    this.hasta = this.pageSize;
  }

  cambiarPagina(e: PageEvent) {
    /*   console.log(e); */
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }


  reset() {
    this.search = null;
    this.proveedores = [];
    this.filteredProveedores = [];
    this.allProveedores();
  }

  /*  probarAlerta() {
     this.toaster.open(NoticyAlertComponent, { text: `primary-La cotización se registró exitosamente.` });
 
   } */

  delete(proveedor) {


    const modalRef = this.modelService.open(DeleteProveedorComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.proveedor_selected = proveedor;
    modalRef.componentInstance.proveedorE.subscribe((resp: any) => {

      if (resp) {


        this._proveedorService.removeProveedor(proveedor).subscribe(
          (resp: any) => {

            if (resp.success) {
              this.toaster.open(NoticyAlertComponent, { text: `info-El proveedor se removió exitosamente.` });
              this.filteredProveedores = this.filteredProveedores.filter((item) => item != proveedor)
              return;
            }
          },
          (error: any) => {
            console.error('Error al actualizar el proveedor:', error);
            this.toaster.open(NoticyAlertComponent, { text: `danger-Ocurrió un error al eliminar el proveedor.` });
            this.reset();
            return;
          }
        )



        /* this.reset();
        this.cdr.detectChanges(); */
      }

      /*  this.allProveedores(); */
      // Forzar la detección de cambios

    })

  }
}
