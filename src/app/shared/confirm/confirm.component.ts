import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent{
  bEliminacion:boolean = false;
  bGrabacion:boolean = false;
  
  constructor(
    public dialogRef: MatDialogRef<ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 


    this.bEliminacion = this.data.bEliminacion;
    this.bGrabacion = this.data.bGrabacion;
  }

}
