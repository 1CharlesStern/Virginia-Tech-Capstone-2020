import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';  //
import { Observable } from "rxjs";         //

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


  companies: string[] = []; //
  // companies = ["Northrop Grumman", "Apple", "Google", "Anthem",
  // "Cisco", "General Electric", "ASUS", "Tencent", "Microsoft", "Acer",
  // "National Aeronautics and Space Administration"];
  curPage = 0;

  constructor(public dialog: MatDialog, private http: HttpClient) { //

  }

  ngOnInit(): void {
    //this.http.get<Company[]>("http://localhost:4200/assets/companies.json") // testing
    this.http.get<Company[]>("http://localhost:8080/api/companies")           // actual
      //.map(data => _.values(data))                                            //
      .subscribe(data => {                                                    //
        compObjs = data;                                                 //

        this.companies = compObjs.map(a => a.name);                      //

        //console.log(data);                                                  //
        //console.log(this.companies);                                        //
    });;                                                                      //
  }

  openDialog(company: String): void {
    const dialogRef = this.dialog.open(StudentComponentDialog, {
      width: '250px',
      data: company
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  pages(): any {
    while (this.companies.length % 9 != 0){
      //Fill empty slots so that the table looks the same
      this.companies.push("");
    }
    return Array(this.companies.length/9)
  }

  paginate(page: number): void{
    if (page < 0){
      page = 0
    }
    if (page > (this.companies.length/9)-1){
      page = (this.companies.length/9)-1
    }
    this.curPage = page
  }

}
@Component({
  selector: 'app-student-dialog',
  templateUrl: 'app-student-dialog.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponentDialog {



  submitted = false;
  cfid: number;     //

  constructor(public dialogRef: MatDialogRef<StudentComponentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: string, private http: HttpClient) {}
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    // Get careerfair table, get max id value from Array
    //this.http.get<CareerFair[]>("http://localhost:4200/assets/careerfairs.json") // testing
    this.http.get<CareerFair[]>("http://localhost:8080/api/careerfairs")          // actual
      .subscribe(data => {                                                          //
        this.cfid = Math.max.apply(Math, data.map(a => a.id));                      //

        console.log("GET interviews");
        console.log(data);                                                        //
    });;
  }

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
    event.preventDefault();
    if (!this.validateNumber()){
      alert('The value you have entered is invalid.');
      return;
    }

    var id = (<HTMLInputElement>document.getElementById("txtStudentID")).value;
    var company = this.data

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    let newinterview = {        //
      studentIDNumber: id,  //
      studentName: (<HTMLInputElement>document.getElementById("txtStudentName")).value,      //
      companyID: compObjs.find(o => o.name === company).id,        //
      date: date,             //
      time: time,             //
      careerFairID: this.cfid      //
    }                           //

    //this.http.post('http://localhost:4200/assets/interviews.json', newinterview); // testing
    this.http.post("http://localhost:8080/api/interviews", newinterview);           // actual

    console.log(newinterview);

    this.submitted = true
  }
}
