import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-cotizacion',
  templateUrl: './list-cotizacion.component.html',
  styleUrls: ['./list-cotizacion.component.scss']
})
export class ListCotizacionComponent implements OnInit {

  
  isLoading$: any = null;

  search: any = null;

  constructor() { }

  ngOnInit(): void {
  }

  allCotizaciones(page = 1) {
    let LINK = "";
    if (this.search) {
      LINK = LINK + "&search=" + this.search;
    }

  }

  reset() {
    this.search = null;
    this.allCotizaciones();
  }

}
