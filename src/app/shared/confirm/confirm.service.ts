import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ConfirmComponent } from './confirm.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

interface confirmData {
  title?: string,
  message?: string
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

 

  constructor(private dialog: MatDialog) { }

  public confirmarEliminacion(data: confirmData = {}): Observable<boolean> {
    
    data.title = data.title || 'Confirm';
    data.message = data.message || 'Are you sure?';
    let dialogRef: MatDialogRef<ConfirmComponent>;
    dialogRef = this.dialog.open(ConfirmComponent, {
      width: '450px',
      disableClose: true,
      data: { title: data.title, message: data.message, bEliminacion: true }
    });
    return dialogRef.afterClosed();
  }

  public confirmarGrabacion(data: confirmData = {}): Observable<boolean> {
    
    data.title = data.title || 'Confirm';
    data.message = data.message || 'Are you sure?';
    let dialogRef: MatDialogRef<ConfirmComponent>;
    dialogRef = this.dialog.open(ConfirmComponent, {
      width: '450px',
      disableClose: true,
      data: { title: data.title, message: data.message, bGrabacion: true }
    });
    return dialogRef.afterClosed();
  }


}
