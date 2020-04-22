import { Component, OnInit, ViewChild, ElementRef, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Component({
  selector: 'app-masterlist',
  templateUrl: './masterlist.component.html',
  styleUrls: ['./masterlist.component.css']
})
@Injectable()
export class MasterlistComponent implements OnInit {

  ascendingSort = false

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getCompanies()
  }

  PAGE_SIZE = 8;
  API_URL = '*'
  API_COMPANY = 'http://localhost:8080/api/companies'
  COMPANY_URL_BASE = 'http://localhost:8080/company/'

  options = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Access-Control-Allow-Origin': this.API_URL
    })
  }

  curPage = 0;

  data = [
    {name: "General Electric", inFair: true},
    {name: "Toshiba", inFair: true},
    {name: "Cisco", inFair: true},
    {name: "Google", inFair: true},
    {name: "Facebook", inFair: true},
    {name: "Amazon", inFair: true},
  ]

  paginate(page: number): void{
    if (page < 0){
      page = 0
    }
    if (page > (this.data.length/9)-1){
      page = (this.data.length/9)-1
    }
    this.curPage = page
  }

  pages() {
    let result = this.data.length / this.PAGE_SIZE
    result = Math.floor(result)+1
    return Array(result);
  }

  handleError(error: HttpErrorResponse){
    if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);
  }
  // return an observable with a user-facing error message
  return throwError(
    'Something bad happened; please try again later.');
  }

  getCompanies(): void {
    this.getCompaniesHTTP().subscribe(data => console.log(data))
  }

  dropCompany(): void {
    //TODO
  }

  addCompany(name: string) {
    this.addCompanyHTTP(name).subscribe(data => console.log(data))
  }

  editCompany(): void {
    //TODO
  }

  getCompaniesHTTP(): Observable<Object> {
    return this.http.get(this.API_COMPANY, this.options)
  }

  addCompanyHTTP(name: string): Observable<Object> {
    let company = {}
    company['name'] = name
    //Generates a random company code of length 5
    company['url'] = this.COMPANY_URL_BASE+Math.random().toString(36).substring(2, 7)
    return this.http.post(this.API_COMPANY, JSON.stringify(company), this.options)
  }

}
