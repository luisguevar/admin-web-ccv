import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../_service/proveedor.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { URL_BACKEND } from 'src/app/config/config';

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

  constructor(
    public _proveedorService: ProveedorService,
    public modelService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._proveedorService.isLoading$;
    this.allProveedores();
  }

  allProveedores() {
    this._proveedorService.allProveedores(1, this.search).subscribe((resp: any) => {
      console.log('Proveedores: ', resp);
      this.proveedores = resp.proveedores;
    })
  }

  reset() {

  }
}
