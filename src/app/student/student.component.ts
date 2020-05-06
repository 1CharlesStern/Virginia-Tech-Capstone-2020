import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { sha256 } from 'js-sha256';
import { Observable } from "rxjs";
import { environment } from '../../environments/environment'

interface Company { //
  id: number,       //
  name: string,     //
  url: string       //
}                   //

interface CareerFair {        //
  id: number,                 //
  name: string,               //
  numberOfCompanies: number,  //
  numberOfStudents: number,   //
  numberOfInterviews: number  //
}                             //

interface Interview {       //
  id: string,               //
  studentIDNumber: number,  //
  studentName: string,      //
  companyID: number,        //
  date: string,             //
  time: string,             //
  careerFairID: number      //
}                           //

let compObjs = []; //

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {


  companies: string[] = [];
  curPage = 0;
  maxPages = 0;
  pageOffset = 0;
  PAGE_WIDTH = 5;
  PAGE_HEIGHT = 4;
  PAGE_SIZE = this.PAGE_WIDTH * this.PAGE_HEIGHT;
  API_URL = environment.apiUrl

  constructor(public dialog: MatDialog, private http: HttpClient, private cd: ChangeDetectorRef) { //

  }
  /*
    GETs companies during initialization
  */
  ngOnInit(): void {
    this.http.get<Company[]>(this.API_URL+"companies")
      .subscribe(data => {
        compObjs = data;
        this.companies = compObjs.map(a => a.name).sort();
        this.cd.detectChanges();
    });
  }
  /*
    Opens the sign-in modal (see bottom)
  */
  openDialog(company: String): void {
    const dialogRef = this.dialog.open(StudentComponentDialog, {
      width: '250px',
      data: company
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  /*
    Returns the number of pages in the data
  */
  pages(): any {
    while (this.companies.length % this.PAGE_SIZE != 0){
      //Fill empty slots so that the table looks the same
      this.companies.push("");
    }
    let result = Math.floor(this.companies.length / this.PAGE_SIZE)

    let indexes = Array()
    this.maxPages = result
    if (result <= 5){
      for (let i = 0; i < result; i++) {
        indexes.push(i+1)
      }
    }
    else {
      if (this.curPage-2 >= 0 && this.curPage+2 < result){
        this.pageOffset = 0
      }
      else if (this.curPage+2 < result){
        if (this.curPage-1 >= 0){
          this.pageOffset = 1
        }
        else {
          this.pageOffset = 2
        }
      }
      else if (this.curPage-2 >= 0){
        if (this.curPage+1 < result){
          this.pageOffset = -1
        }
        else {
          this.pageOffset = -2
        }
      }
      for (let i = this.curPage-2+this.pageOffset; i <= this.curPage+2+this.pageOffset; i++) {
        indexes.push(i+1)
      }
    }
    return indexes
  }
  /*
    Navigates to another page
  */
  paginate(page: number): void{
    if (page < 0){
      page = 0
    }
    if (page > (this.companies.length/this.PAGE_SIZE)-1){
      page = (this.companies.length/this.PAGE_SIZE)-1
    }
    this.curPage = page
    this.pages()
  }

  /*
    Returns iterable for template page
  */
  height(){
    return Array(this.PAGE_HEIGHT)
  }

}


/*
  This nested component controls the modal that appears
  when a user clicks "Sign In" for a particular company
*/
@Component({
  selector: 'app-student-dialog',
  templateUrl: 'app-student-dialog.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponentDialog {

  constructor(public dialogRef: MatDialogRef<StudentComponentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: string, private http: HttpClient) {}
  onNoClick(): void {
    this.dialogRef.close();
  }

  API_URL = "http://epsilon.cs.vt.edu:8080/cs4704/api/"

  submitted = false;
  cfid: number;

  //Used in POSTs
  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  /*
    GET careerfair table, only using the max value
    This is used to track which careerfair an interview
    originates from
  */
  ngOnInit(): void {
    this.http.get<CareerFair[]>(this.API_URL+"careerfairs")
      .subscribe(data => {
        this.cfid = Math.max.apply(Math, data.map(a => a.id));
    });;
  }

  /*
    Takes the value entered in the Student ID field and
    validates it.  Valid IDs are numeric, less than 10
    characters long, and begin with a 9.
    Also scrubs off extraneous characters from card swipers.
  */
  validateNumber() {
    var obj = <HTMLInputElement>document.getElementById("txtStudentID");
    var start = obj.value.indexOf('9');

    if (start != -1 && obj.value.length >= 9) {
        obj.value = obj.value.substring(start, start + 9);
        return true;
    } else {
        return false;
    }
  }

  submit(event: Event){
    //Confirm validation of ID
    event.preventDefault();
    if (!this.validateNumber()){
      alert('The value you have entered is invalid.');
      return;
    }

    //Student name cannot be empty
    var name = (<HTMLInputElement>document.getElementById("txtStudentName")).value
    if (name == ""){
      return;
    }

    //Compose request
    var id = (<HTMLInputElement>document.getElementById("txtStudentID")).value;
    var company = this.data

    var today = new Date()
    var today2 = new Date(new Date(today).getTime() + 60 * 60 * 24 * 1000);

    let newinterview = {
      studentIDNumber: sha256(id),
      studentName: name,
      companyID: compObjs.find(o => o.name === company).id,
      time: today.toTimeString().substring(0, 8),
      date: today2.toISOString().substring(0, 10),
      careerFairID: this.cfid
    }

    //Send request
    this.http.post(this.API_URL+"interviews", JSON.stringify(newinterview), this.options)
      .subscribe();

    this.submitted = true
  }
}
