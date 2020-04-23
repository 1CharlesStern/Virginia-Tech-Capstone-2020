import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private router: Router) { }

  API_AUTH = 'https://localhost:8080/api/users'
  API_COMPANY = 'http://localhost:8080/api/companies'
  COMPANY_URL_BASE = 'http://localhost:4200/company/'

  options = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':  '*',
      'Content-Type': 'application/json'
    })
  }

  checkToken(){
    let token = localStorage.getItem('token')
    //TODO check token expiration date
    return this.router.parseUrl('/login')
  }

  getCompaniesHTTP(): Observable<any> {
    return this.http.get(this.API_COMPANY)
  }

  addCompanyHTTP(name: string): Observable<any> {
    let company = {}
    company['name'] = name
    //Generates a random company code of length 5
    company['url'] = this.COMPANY_URL_BASE+Math.random().toString(36).substring(2, 7)
    return this.http.post(this.API_COMPANY, JSON.stringify(company), this.options)
  }

  dropCompanyHTTP(id: string): Observable<any>{
    return this.http.delete(this.API_COMPANY+'/'+id, this.options)
  }

  submitLogin(hash: string): Observable<any>{
    let login = {}
    login['username'] = 'admin';
    login['password'] = hash
    return this.http.post(this.API_AUTH, login, this.options)
  }
}
