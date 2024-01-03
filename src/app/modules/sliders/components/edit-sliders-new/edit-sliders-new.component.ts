import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { URL_BACKEND } from 'src/app/config/config';
import { SlidersService } from '../../_services/sliders.service';

@Component({
  selector: 'app-edit-sliders-new',
  templateUrl: './edit-sliders-new.component.html',
  styleUrls: ['./edit-sliders-new.component.scss']
})
export class EditSlidersNewComponent implements OnInit {

  @Input() slider_selected:any;
  @Output() sliderE: EventEmitter<any> = new EventEmitter();
  isLoading$:any;
  isLoading:boolean = false;

  name:any = null;
  url:any = null;
  imagen_file:any = null;
  imagen_previzualiza:any = null;
  constructor(
    public _slidersService: SlidersService,
    public modal: NgbActiveModal,
    public toaster: Toaster,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._slidersService.isLoading$;
    this.name = this.slider_selected.name;
    this.url = this.slider_selected.url;
    this.imagen_previzualiza = URL_BACKEND+'storage/'+this.slider_selected.imagen;
  }

  processFile($event){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.toaster.open(NoticyAlertComponent,{text:`danger-'EL ARCHIVO CARGADO NO ES UNA IMAGEN'`});
      return;
    }
    this.imagen_file = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.imagen_file);
    reader.onloadend = () => this.imagen_previzualiza = reader.result;
    // setTimeout(() => {
    //   console.log(this.imagen_previzualiza);
    // }, 25);
  }

  save(){
    let formData = new FormData();
    formData.append("imagen_file",this.imagen_file);
    if(this.name){
      formData.append("name",this.name);
    }
    if(this.url){
      formData.append("url",this.url);
    }
    this._slidersService.updateSlider(this.slider_selected.id,formData).subscribe((resp:any) => {
      console.log(resp);
      this.toaster.open(NoticyAlertComponent,{text:`primary-'LA SLIDER SE  A EDITADO DE MANERA CORRECTA.'`});
      this.sliderE.emit(resp.slider);
      this.modal.close();
    })
  }


}
