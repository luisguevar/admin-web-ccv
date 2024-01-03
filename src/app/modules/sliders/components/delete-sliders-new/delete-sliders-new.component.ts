import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SlidersService } from '../../_services/sliders.service';

@Component({
  selector: 'app-delete-sliders-new',
  templateUrl: './delete-sliders-new.component.html',
  styleUrls: ['./delete-sliders-new.component.scss']
})
export class DeleteSlidersNewComponent implements OnInit {

  @Input() slider_selected:any = null;
  @Output() sliderE: EventEmitter<any> = new EventEmitter();
  
  isLoading$;
  isLoading = false;

  constructor(
    public _slidersService: SlidersService,
    public modal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._slidersService.isLoading$;
  }

  delete(){
    this._slidersService.deleteSlider(this.slider_selected.id).subscribe((resp:any) => {
      console.log(resp);
      this.modal.close();
      this.sliderE.emit(this.slider_selected);
    })
  }

}
