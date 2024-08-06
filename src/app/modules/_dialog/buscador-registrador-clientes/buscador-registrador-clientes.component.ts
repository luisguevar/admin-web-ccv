import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../auth';
import { ServiciosGeneralService } from '../../servicios-general.service';
import { PageEvent } from '@angular/material/paginator';
import { ClienteEntity } from 'src/app/Models/ClienteEntity';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-buscador-registrador-clientes',
  templateUrl: './buscador-registrador-clientes.component.html',
  styleUrls: ['./buscador-registrador-clientes.component.scss']
})
export class BuscadorRegistradorClientesComponent implements OnInit {
  isLoading$;
  isLoading: boolean = false;
  cTitle: string = '';
  bEdit: boolean = false;
  usuario_dni: string = '';
  myForm: FormGroup;
  lstEstados = [
    { nIdEstado: 1, cEstado: 'Activo' },
    { nIdEstado: 0, cEstado: 'Inactivo' },
  ];
  paises: any;
  ciudades: any;
  //paginacion
  pageSize = 3;
  desde: number = 0;
  hasta: number = 3;

  listClientes: any = [];
  filteredClientes: any = [];
  search: string = '';
  clientes: any;

  //Form
  name: string = null;
  surname: string = null;
  phone: string = null;
  documentNumber: string = null;
  bBotonGuardar: boolean = false;
  cliente_id: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BuscadorRegistradorClientesComponent>,
    public fb: FormBuilder,
    public authservice: AuthService,
    public _service: ServiciosGeneralService,
    public toaster: Toaster,
  ) {

    this.usuario_dni = this.authservice.user.cDocumento;
    this.bEdit = this.data.bEdit;

    this.cTitle = this.data.cTitle;
    this.myForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }
  get f() { return this.myForm.controls; }

  ngOnInit(): void {
    setTimeout(() => {
      this.BotonListarClientes();
    }, 10);
  }



  InputBuscarClientes() {
    // Filtra la lista completa de clientes según el término de búsqueda
    const clientesFiltrados = this.listClientes.filter(cliente =>
      cliente.cNombres.toLowerCase().includes(this.search.toLowerCase()) ||
      cliente.cApellidos.toLowerCase().includes(this.search.toLowerCase()) ||
      cliente.cCorreo.toLowerCase().includes(this.search.toLowerCase())
    );



    // Asigna la lista filtrada a filteredClientes y luego aplica la paginación
    this.filteredClientes = clientesFiltrados;
    this.desde = 0;  // Reinicia la paginación a la primera página
    this.hasta = this.pageSize;
  }

  public BotonListarClientes() {
    this._service.GetClientes(1).subscribe((resp: any) => {
      console.log('Clientes: ', resp);
      this.listClientes = resp.clientes;
      // Inicializa los clientes filtrados con la lista completa al principio
      this.filteredClientes = [...this.listClientes];
    });
  }

  BotonSeleccionarCliente(cliente) {
    this.dialogRef.close(cliente); //Devolver cliente al cerrar el modal;
  }

  BotonReiniciar() {
    this.search = '';
    this.BotonListarClientes();
  }

  BotonGuardarCliente() {

    //registro rápido

    // Determinar el tipo de documento
    let nTipoDocumento: number;
    if (this.documentNumber.length == 8) {
      nTipoDocumento = 1; // DNI
    } else if (this.documentNumber.length == 10) {
      nTipoDocumento = 2; // RUC
    } else if (this.documentNumber.length > 10) {
      nTipoDocumento = 3; // CE
    } else {
      nTipoDocumento = 1; // 
    }

    const cliente = new ClienteEntity();
    cliente.cNombres = this.name;
    cliente.cApellidos = this.surname;
    cliente.cCorreo = this.f.email.value;
    cliente.cCelular = this.phone;
    cliente.cNroDocumento = this.documentNumber;
    cliente.nEstado =1;
    cliente.cUsuarioCreacion = this.usuario_dni;
    cliente.cUsuarioModificacion = this.usuario_dni;
    cliente.nTipoDocumento = nTipoDocumento;

    this._service.PostClientes(cliente).subscribe((resp: any) => {

      if (resp.success) {

        this.toaster.open(NoticyAlertComponent, { text: `primary-'Cliente guardado correctamente'` });
        this.cliente_id = resp.cliente.id;
        this.dialogRef.close(resp.cliente); //Devolver cliente al cerrar el modal;

      } else {
        this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al guardar el Cliente.'` });
      }


    },
      (error: any) => {

        /* console.log(error); */
        if (error.status === 400 && error.error.message) {
          this.toaster.open(NoticyAlertComponent, { text: `danger-'${error.error.message}'` });
        } else {
          this.toaster.open(NoticyAlertComponent, { text: `danger-'Ocurrió un problema al guardar el Cliente.'` });
        }
      }


    )



  }

  /*  if (resp.success) {
         const data = {
           id: resp.cliente_id,
           nombres: resp.nombres,
           apellidos: resp.apellidos,
           nroDocumento: resp.nroDocumento
         };
 
 
       } */

  BotonEstadoHeader(estado: boolean) {
    this.bBotonGuardar = estado;
  }
  cambiarPagina(e: PageEvent) {
    console.log(e);
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }
}
