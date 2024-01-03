import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductsService } from '../../../_services/products.service';

@Component({
  selector: 'app-delete-item-inventario',
  templateUrl: './delete-item-inventario.component.html',
  styleUrls: ['./delete-item-inventario.component.scss']
})
export class DeleteItemInventarioComponent implements OnInit {

  @Input() inventario:any = null;
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
    this._productService.deleteInventario(this.inventario.id).subscribe((resp:any) => {
      console.log(resp);
      this.modal.close();
      this.inventarioG.emit(this.inventario);
    })
  }

}
