import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { ProductsService } from '../../../_services/products.service';

@Component({
  selector: 'app-edit-item-inventario',
  templateUrl: './edit-item-inventario.component.html',
  styleUrls: ['./edit-item-inventario.component.scss']
})
export class EditItemInventarioComponent implements OnInit {

  @Output() inventarioG: EventEmitter<any> = new EventEmitter();
  @Input() inventario:any;

  isLoading$:any;
  name:any = null;
  constructor(
    public _productService: ProductsService,
    public modal: NgbActiveModal,
    public toaster: Toaster,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._productService.isLoadingSubject;
    this.name = this.inventario.name;
  }
  save(){
    let data = {
      name: this.name,
    };
    this._productService.updateInventario(this.inventario.id,data).subscribe((resp:any)=>{
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open(NoticyAlertComponent,{text:`danger-'${resp.text_message}'`});
        return;
      }else{
        this.inventarioG.emit(resp.product_size);
        this.modal.close()
        this.toaster.open(NoticyAlertComponent,{text:`primary-'SE HA REGISTRADO LOS CAMBIOS EN ESTE REGISTRO'`});
          return;
      }
    })
  }
}
