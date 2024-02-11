import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { CotizacionService } from '../../cotizaciones/_service/cotizacion.service';

@Component({
  selector: 'app-add-cliente-dialog',
  templateUrl: './add-cliente-dialog.component.html',
  styleUrls: ['./add-cliente-dialog.component.scss']
})
export class AddClienteDialogComponent implements OnInit {

  @Output() clienteE: EventEmitter<any> = new EventEmitter();

  //paginacion
  pageSize = 3;
  desde: number = 0;
  hasta: number = 3;

  listClientes: any = [];
  filteredClientes: any = [];

  search: string = '';

  //regisro rápido
  nombres: any = null;
  apellidos: any = null;
  correo: any = null;
  formGroup: FormGroup;



  constructor(
    public toaster: Toaster,
    public _CotizacionService: CotizacionService,
    public modelService: NgbModal,
    public modal: NgbActiveModal,
    public fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.allClientes();

    }, 10);
    this.loadForm();
  }
  loadForm() {
    this.formGroup = this.fb.group({
      name: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      surname: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      nroDocumento: [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)])],
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.maxLength(249),
        ])
      ]

    });
  }

  allClientes() {
    this._CotizacionService.allClientes().subscribe((resp: any) => {
      console.log('Clientes: ', resp);
      this.listClientes = resp.clientes;
      // Inicializa los clientes filtrados con la lista completa al principio
      this.filteredClientes = [...this.listClientes];
    });
  }

  cambiarPagina(e: PageEvent) {
    console.log(e);
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }

  buscarClientes() {
    // Filtra la lista completa de clientes según el término de búsqueda
    const clientesFiltrados = this.listClientes.filter(cliente =>
      cliente.nombres.toLowerCase().includes(this.search.toLowerCase()) ||
      cliente.apellidos.toLowerCase().includes(this.search.toLowerCase())
    );



    // Asigna la lista filtrada a filteredClientes y luego aplica la paginación
    this.filteredClientes = clientesFiltrados;
    this.desde = 0;  // Reinicia la paginación a la primera página
    this.hasta = this.pageSize;
  }

  seleccionarCliente(cliente: any) {
    this.modal.close();
    this.clienteE.emit(cliente);
    return;
  }

  registrarClienteRapido() {

    this._CotizacionService.createClienteRapido(this.formGroup.value).subscribe((resp: any) => {
      console.log(resp);
      if (resp.success) {
        const data = {
          id: resp.cliente_id,
          nombres: resp.nombres,
          apellidos: resp.apellidos,
          nroDocumento: resp.nroDocumento
        };

        this.modal.close();
        this.clienteE.emit(data);
        return;
      }
    })
    console.log('Modelo para guardar: ', this.formGroup.value);
  }

  reset() {
    this.allClientes();
    this.search = null;
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }

}
