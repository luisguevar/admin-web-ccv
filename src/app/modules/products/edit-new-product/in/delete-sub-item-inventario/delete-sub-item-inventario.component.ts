import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductsService } from '../../../_services/products.service';

@Component({
  selector: 'app-delete-sub-item-inventario',
  templateUrl: './delete-sub-item-inventario.component.html',
  styleUrls: ['./delete-sub-item-inventario.component.scss']
})
export class DeleteSubItemInventarioComponent implements OnInit {

  @Input() sub_inventario:any = null;
  @Output() inventarioG: EventEmitter<any> = new EventEmitter();
  
  isLoading$;
  isLoading = false;

  constructor(
    public _productService: ProductsService,
    public modal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._productService.isLoading$;
  }

  delete(){
    this._productService.deleteSubInventario(this.sub_inventario.id).subscribe((resp:any) => {
      console.log(resp);
      this.modal.close();
      this.inventarioG.emit(this.sub_inventario);
    })
  }

}
