import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';


/*
  Handles a number of HTTP requests so that other components don't have to.
*/
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private router: Router) { }

  API_URL = "http://epsilon.cs.vt.edu:8080/cs4704/api/"
  API_COMPANY = this.API_URL+"companies"
  API_AUTH = this.API_URL+'users/login'

  //Used for general requests
  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  //Used for login requests to avoid CORS preflight
  headers = new HttpHeaders({
    'Content-Type': 'text/plain'
  })

  /*
    Sends a GET for all company records
  */
  getCompaniesHTTP(): Observable<any> {
    return this.http.get(this.API_COMPANY)
  }
  /*
    Sends a POST to create a new company
  */
  addCompanyHTTP(name: string): Observable<any> {
    let company = {}
    company['name'] = name
    //Generates a random company code of length 5
    company['url'] = Math.random().toString(36).substring(2, 7)
    return this.http.post(this.API_COMPANY, JSON.stringify(company), this.options)
  }
  /*
    Sends a DELETE to destroy a company in the database
    Interview records from that company will persist
  */
  dropCompanyHTTP(id: string): Observable<any>{
    return this.http.delete(this.API_COMPANY+'/'+id, this.options)
  }
  /*
    Sends a POST with hashed login information
  */
  submitLogin(user: string, hash: string): Observable<any>{
    let login = {}
    login['username'] = user;
    login['password'] = hash;
    return this.http.post(this.API_AUTH, login, {headers: this.headers, observe: 'response'})
  }
}
