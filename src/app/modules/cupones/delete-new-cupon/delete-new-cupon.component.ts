import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CuponesService } from '../_services/cupones.service';

@Component({
  selector: 'app-delete-new-cupon',
  templateUrl: './delete-new-cupon.component.html',
  styleUrls: ['./delete-new-cupon.component.scss']
})
export class DeleteNewCuponComponent implements OnInit {

  @Input() cupon_selected:any = null;
  @Output() cuponE: EventEmitter<any> = new EventEmitter();
  
  isLoading$;
  isLoading = false;

  constructor(
    public _cuponesServices:CuponesService,
    public modal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._cuponesServices.isLoading$;
  }

  delete(){
    this._cuponesServices.deleteCupones(this.cupon_selected.id).subscribe((resp:any) => {
      console.log(resp);
      this.modal.close();
      this.cuponE.emit(this.cupon_selected);
    })
  }

}
