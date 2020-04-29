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

  COMPANY_URL_BASE = 'http://epsilon.cs.vt.edu/company/'
  API_URL = "http://epsilon.cs.vt.edu:8080/cs4704/api/"
  API_COMPANY = this.API_URL+"companies"
  API_AUTH = this.API_URL+'users/login'

  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  headers = new HttpHeaders({
    'Content-Type': 'text/plain'
  })

  getCompaniesHTTP(): Observable<any> {
    return this.http.get(this.API_COMPANY)
  }

  addCompanyHTTP(name: string): Observable<any> {
    let company = {}
    company['name'] = name
    //Generates a random company code of length 5
    company['url'] = Math.random().toString(36).substring(2, 7)
    return this.http.post(this.API_COMPANY, JSON.stringify(company), this.options)
  }

  dropCompanyHTTP(id: string): Observable<any>{
    return this.http.delete(this.API_COMPANY+'/'+id, this.options)
  }

  submitLogin(user: string, hash: string): Observable<any>{
    let login = {}
    login['username'] = user;
    login['password'] = hash;
    console.log(JSON.stringify(login))
    return this.http.post(this.API_AUTH, login, {headers: this.headers, observe: 'response'})
  }
}
