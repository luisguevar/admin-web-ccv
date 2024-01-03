import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-new-cotizacion',
  templateUrl: './add-new-cotizacion.component.html',
  styleUrls: ['./add-new-cotizacion.component.scss']
})
export class AddNewCotizacionComponent implements OnInit {
  isLoading$: any = null;

  search: any = null;
  constructor() { }

  ngOnInit(): void {
  }

  createCotizacion() {

  }
}
