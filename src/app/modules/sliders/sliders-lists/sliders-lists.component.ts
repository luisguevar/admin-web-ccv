import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { URL_BACKEND } from 'src/app/config/config';
import { AddSlidersNewComponent } from '../components/add-sliders-new/add-sliders-new.component';
import { DeleteSlidersNewComponent } from '../components/delete-sliders-new/delete-sliders-new.component';
import { EditSlidersNewComponent } from '../components/edit-sliders-new/edit-sliders-new.component';
import { SlidersService } from '../_services/sliders.service';

@Component({
  selector: 'app-sliders-lists',
  templateUrl: './sliders-lists.component.html',
  styleUrls: ['./sliders-lists.component.scss']
})
export class SlidersListsComponent implements OnInit {

  isLoading$;
  search:any = null;
  
  sliders:any = [];
  URL_BACKEND:any = URL_BACKEND;

  constructor(
    public _slidersService: SlidersService,
    public modelService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._slidersService.isLoading$;
    this.allSliders();
  }
  allSliders(){
    this._slidersService.allSliders().subscribe((resp:any)=>{
      console.log(resp);
      this.sliders = resp.sliders;
    })
  }

  addSlider(){
    const modalRef = this.modelService.open(AddSlidersNewComponent, {centered : true, size: 'sm'});
    modalRef.result.then(
      () => {

      },
      () => {
        
      }
    )
    modalRef.componentInstance.sliderE.subscribe((resp:any)=>{
      // console.log(resp);
      this.sliders.unshift(resp);
    });
  }

  edit(slider){
    const modalRef = this.modelService.open(EditSlidersNewComponent, {centered : true, size: 'sm'});
    modalRef.componentInstance.slider_selected = slider;
    modalRef.result.then(
      () => {

      },
      () => {
        
      }
    )
    modalRef.componentInstance.sliderE.subscribe((resp:any) => {
      let INDEX = this.sliders.findIndex(item => item.id == resp.id);
      this.sliders[INDEX] = resp;
    })
  }
  delete(slider){
    const modalRef = this.modelService.open(DeleteSlidersNewComponent, {centered : true, size: 'sm'});
    modalRef.componentInstance.slider_selected = slider;
    modalRef.result.then(
      () => {

      },
      () => {
        
      }
    )
    modalRef.componentInstance.sliderE.subscribe((resp:any) => {
      let INDEX = this.sliders.findIndex(item => item.id == resp.id);
      this.sliders.splice(INDEX,1);
    })
  }

}
