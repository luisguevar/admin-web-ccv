import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from '../../auth';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  allCategories(page=1,search=''){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization' : 'Bearer '+this.authservice.token});
    let LINK = "";
    if(search){
      LINK = LINK + "&search="+search;
    }
    let URL = URL_SERVICIOS + "/products/categories/all?page="+page+LINK;
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  createCategoria(data:any){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization' : 'Bearer '+this.authservice.token});
    let URL = URL_SERVICIOS + "/products/categories/add";
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  updateCategoria(categorie_id:any, data:any){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization' : 'Bearer '+this.authservice.token});
    let URL = URL_SERVICIOS + "/products/categories/update/"+categorie_id;
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  deleteCategoria(categorie_id:any){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization' : 'Bearer '+this.authservice.token});
    let URL = URL_SERVICIOS + "/products/categories/delete/"+categorie_id;
    return this.http.delete(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
