import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth';
import { URL_SERVICIOS } from '../config/config';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiciosGeneralService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;


  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }


  GetUsuarios(nEstado: number) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/usuarios/admin/all?nEstado=" + nEstado;
    /* console.log(URL); */
    return this.http.get(URL, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  PostUsuarios(data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/usuarios/admin/add";
    return this.http.post(URL, data, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  PutUsuarios(usuario_id: any, data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/usuarios/admin/update/" + usuario_id;
    return this.http.post(URL, data, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }


  GetClientes(nEstado: number) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/clientes/all?nEstado=" + nEstado;
    /* console.log(URL); */
    return this.http.get(URL, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  PostClientes(data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/clientes/add";
    return this.http.post(URL, data, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  PostClientesRapido(data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/cotizaciones/addClienteRapido";
    return this.http.post(URL, data, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  PutClientes(cliente_id: any, data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/clientes/update/" + cliente_id;
    return this.http.post(URL, data, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  GetCategorias(nEstado: number) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });

    let URL = URL_SERVICIOS + "/productos/categorias/all?nEstado=" + nEstado;
    /* console.log(URL); */
    return this.http.get(URL, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  PostCategoria(data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/productos/categorias/add";
    return this.http.post(URL, data, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  PutCategoria(categorie_id: any, data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/productos/categorias/update/" + categorie_id;
    return this.http.post(URL, data, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  RemoveCategoria(data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/productos/categorias/remove/" + data.id;
    return this.http.put(URL, data, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  GetProductos(nEstado: number, categoria_id: number, nTipoStock: number, startDate: any, endDate: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });

    let URL = URL_SERVICIOS + "/productos/sp_all?nEstado=" + nEstado
      + "&categoria_id=" + categoria_id
      + "&nTipoStock=" + nTipoStock;

    // Verificar si startDate y endDate son válidos y convertirlos a string
    if (startDate) {
      const start = new Date(startDate);
      URL += "&fechaInicio=" + start.toISOString().split('T')[0];
    }

    if (endDate) {
      const end = new Date(endDate);
      URL += "&fechaFin=" + end.toISOString().split('T')[0];
    }

    return this.http.get(URL, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }



  GetProductoPorId(producto_id) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/productos/show_producto/" + producto_id;
    return this.http.get(URL, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }


  PostProducto(data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/productos/add";
    return this.http.post(URL, data, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  PutProducto(producto_id: number, data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/productos/update/" + producto_id;
    return this.http.post(URL, data, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  addImagenProduct(data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/productos/addImagen";
    return this.http.post(URL, data, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  deleteImagenProduct(imagen_id: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/productos/removeImagen/" + imagen_id;
    return this.http.delete(URL, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  GetProveedores(nEstado: number) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });

    let URL = URL_SERVICIOS + "/proveedores/all?nEstado=" + nEstado;
    return this.http.get(URL, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  PostProveedor(data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/proveedores/add";
    return this.http.post(URL, data, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  PutProveedor(proveedor_id: number, data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/proveedores/update/" + proveedor_id;
    return this.http.put(URL, data, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  GetProveedorPorId(proveedor_id) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/proveedores/show_proveedor/" + proveedor_id;
    return this.http.get(URL, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }


  RemoveProveedor(data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/proveedores/remove/" + data.id;
    return this.http.put(URL, data, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  /* GetCotizaciones(nEstado: number, cCorrelativo: string,) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });

    let URL = URL_SERVICIOS + "/cotizaciones/all?nEstado=" + nEstado;
    return this.http.get(URL, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  } */

  GetCotizaciones(nEstado: number, cCorrelativo: string, startDate: any, endDate: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });

    let URL = URL_SERVICIOS + "/cotizaciones/all?nEstado=" + nEstado

    if (cCorrelativo) {
      const corrrelativo = cCorrelativo;
      URL += "&cCorrelativo=" + cCorrelativo;
    }
    if (startDate) {
      const start = new Date(startDate);
      URL += "&dFechaEmisionInicio=" + start.toISOString().split('T')[0];
    }

    if (endDate) {
      const end = new Date(endDate);
      URL += "&dFechaEmisionFin=" + end.toISOString().split('T')[0];
    }

    return this.http.get(URL, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  GetCotizacionPorId(cotizacion_id) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/cotizaciones/show_cotizacion/" + cotizacion_id;
    return this.http.get(URL, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  PostCotizacion(data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/cotizaciones/add";
    return this.http.post(URL, data, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }


  PutCotizacion(cotizacion_id: number, data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/cotizaciones/update/" + cotizacion_id;
    return this.http.put(URL, data, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  RemoveCotizacion(data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/cotizaciones/remove/" + data.id;
    return this.http.put(URL, data, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  GetPaises() {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/paises/all";
    return this.http.get(URL, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  GetCiudades(pais_id) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/paises/show/" + pais_id;
    return this.http.get(URL, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  GetVentas(nEstado: number, cCorrelativo: string, startDate: any, endDate: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });

    let URL = URL_SERVICIOS + "/ventas/all?nEstado=" + nEstado

    if (cCorrelativo) {
      const corrrelativo = cCorrelativo;
      URL += "&cCorrelativo=" + cCorrelativo;
    }
    if (startDate) {
      const start = new Date(startDate);
      URL += "&dFechaInicio=" + start.toISOString().split('T')[0];
    }

    if (endDate) {
      const end = new Date(endDate);
      URL += "&dFechaFin=" + end.toISOString().split('T')[0];
    }

    return this.http.get(URL, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  GetVentaPorId(venta_id) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/ventas/show/" + venta_id;
    return this.http.get(URL, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  PostVenta(data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/ventas/add";
    return this.http.post(URL, data, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

}
