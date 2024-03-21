import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { URL_BACKEND } from 'src/app/config/config';
import { AddCategorieComponent } from '../components/add-categorie/add-categorie.component';
import { DeleteCategorieComponent } from '../components/delete-categorie/delete-categorie.component';
import { EditCategorieComponent } from '../components/edit-categorie/edit-categorie.component';
import { CategorieService } from '../_services/categorie.service';
import { PageEvent } from '@angular/material/paginator';
import { ConfirmService } from 'src/app/shared/confirm/confirm.service';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-categorie-list',
  templateUrl: './categorie-list.component.html',
  styleUrls: ['./categorie-list.component.scss']
})
export class CategorieListComponent implements OnInit {

  isLoading$;
  search: any = null;

  categorias: any = [];
  URL_BACKEND: any = URL_BACKEND;
  filteredCategorias: any = [];

  //paginacion
  pageSize = 5;
  desde: number = 0;
  hasta: number = 5;

  //filtro
  state: any = 1;

  constructor(
    public _categorieService: CategorieService,
    public modelService: NgbModal,
    public confirmService: ConfirmService,
    public toaster: Toaster,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._categorieService.isLoading$;
    this.allCategories();
  }
  allCategories() {
    this._categorieService.allCategories(1, this.state, this.search).subscribe((resp: any) => {
      console.log(resp);
      this.categorias = resp.categorias;
      this.filteredCategorias = [...this.categorias];
    })
  }

  reset() {
    this.search = null;
    this.allCategories();
  }
  addCategoria() {
    const modalRef = this.modelService.open(AddCategorieComponent, { centered: true, size: 'lg' });

    modalRef.componentInstance.clientsE.subscribe((resp: any) => {
      if (resp) {
        this.allCategories();
        this.toaster.open(NoticyAlertComponent, { text: `primary-'La categoría se guardó exitosamente.'` });
      }

    });
  }

  edit(categoria) {
    const modalRef = this.modelService.open(EditCategorieComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.categoria_selected = categoria;

    modalRef.componentInstance.clientsE.subscribe((resp: any) => {
      if (resp) {
        this.allCategories();
        this.toaster.open(NoticyAlertComponent, { text: `success-'La categoría se actualizó exitosamente.'` });
      }

    })
  }


  delete(categoria) {
    console.log('categoria: ', categoria);
    var title = 'Remover Categoría: ' + categoria.name;
    var mensaje = '¿Está seguro que desea remover esta categoría?';

    //llamamos al servicio de confirmarEliminacion y le pasamos parámetros
    this.confirmService.confirmarEliminacion({ title: title, message: mensaje })
      .subscribe(result => {
        if (result) {
          /* Colocar aquí procedimiento al confirmar elimninación */

          this._categorieService.removeCategoria(categoria).subscribe(
            (resp: any) => {

              if (resp.success) {
                this.toaster.open(NoticyAlertComponent, { text: `info-La categoría se removió exitosamente.` });
                this.filteredCategorias = this.filteredCategorias.filter((item) => item != categoria);
                console.log('resp: ', resp);
                return;
              }
            },
            (error: any) => {
              console.error('Error al actualizar la categoría:', error);
              this.toaster.open(NoticyAlertComponent, { text: `danger-Ocurrió un error al remover la categoría.` });
              this.reset();
              return;
            }
          )
        }

      });

  }

  cambiarPagina(e: PageEvent) {
    /*   console.log(e); */
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }

  buscarCategorias() {
    
    const categoriasFiltradas = this.categorias.filter(categoria =>
      categoria.name.toLowerCase().includes(this.search.toLowerCase())
    );

   
    this.filteredCategorias = categoriasFiltradas;
    this.desde = 0;  // Reinicia la paginación a la primera página
    this.hasta = this.pageSize;
  }
}
