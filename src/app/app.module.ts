import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbDatepickerModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/_services/auth.service';
import { environment } from 'src/environments/environment';
// Highlight JS
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { SplashScreenModule } from './_metronic/partials/layout/splash-screen/splash-screen.module';
// #fake-start#
import { FakeAPIService } from './_fake/fake-api.service';
import { NoticyAlertComponent } from './componets/notifications/noticy-alert/noticy-alert.component';
import { ToastNotificationsModule } from 'ngx-toast-notifications';
import { AddClienteDialogComponent } from './modules/_dialog/add-cliente-dialog/add-cliente-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CRUDTableModule } from './_metronic/shared/crud-table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SpinnerModule } from './shared/spinner/spinner.module';
import { AddProductoDialogComponent } from './modules/_dialog/add-producto-dialog/add-producto-dialog.component';
import { ConfirmComponent } from './shared/confirm/confirm.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { AddEditCategoriaComponent } from './modules/categorias/add-edit-categoria/add-edit-categoria.component';
import localEsPeru from '@angular/common/locales/es-PE';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localEsPeru);
/* import { CreatePuntoVentaComponent } from './modules/puntoVenta/create-punto-venta/create-punto-venta.component'; */
// #fake-end#

function appInitializer(authService: AuthService) {
  return () => {
    // return new Promise((resolve) => {
    //   authService.getUserByToken().subscribe().add(resolve);
    // });
  };
}


@NgModule({
  declarations: [AppComponent, NoticyAlertComponent, AddClienteDialogComponent, AddProductoDialogComponent, ConfirmComponent, AddEditCategoriaComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SplashScreenModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    HighlightModule,
    ClipboardModule,

    // #fake-start#
    environment.isMockEnabled
      ? HttpClientInMemoryWebApiModule.forRoot(FakeAPIService, {
        passThruUnknownUrl: true,
        dataEncapsulation: false,
      })
      : [],
    // #fake-end#
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule,
    MatPaginatorModule,
    SpinnerModule,
    ToastNotificationsModule.forRoot({ duration: 5000, position: 'top-right' }),
    MatDialogModule, MatButtonModule
  ],
  providers: [
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: appInitializer,
    //   multi: true,
    //   deps: [AuthService],
    // },
    
    {
    /*   provide: LOCALE_ID, useValue: 'es-PE', */
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
     
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          xml: () => import('highlight.js/lib/languages/xml'),
          typescript: () => import('highlight.js/lib/languages/typescript'),
          scss: () => import('highlight.js/lib/languages/scss'),
          json: () => import('highlight.js/lib/languages/json')
        },
      },
    },
  ],
  exports: [
    NoticyAlertComponent,
    AddClienteDialogComponent,
    AddProductoDialogComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
