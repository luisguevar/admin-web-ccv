import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CategorieService } from '../../_services/categorie.service';

@Component({
  selector: 'app-delete-categorie',
  templateUrl: './delete-categorie.component.html',
  styleUrls: ['./delete-categorie.component.scss']
})
export class DeleteCategorieComponent implements OnInit {

  @Input() categoria_selected:any = null;
  @Output() clientsE: EventEmitter<any> = new EventEmitter();
  
  isLoading$;
  isLoading = false;

  constructor(
    public _categoriaService: CategorieService,
    public modal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._categoriaService.isLoading$;
  }

  delete(){
    this._categoriaService.deleteCategoria(this.categoria_selected.id).subscribe((resp:any) => {
      console.log(resp);
      this.modal.close();
      this.clientsE.emit(this.categoria_selected);
    })
  }


}
