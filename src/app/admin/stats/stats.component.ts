import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Company {
  id: number,
  name: string,
  url: string
}

interface CareerFair {
  id: number,
  name: string,
  numberOfCompanies: number,
  numberOfStudents: number,
  numberOfInterviews: number
}

interface Interview {
  id: string,
  studentIDNumber: number,
  studentName: string,
  companyID: number,
  date: string,
  time: string,
  careerFairID: number
}

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  numStudents = 0
  numInterviews = 0
  numCompanies = 0

  dateFormat = 'MMM d, y, h:mm a'

  curPage = 0

  cfid = 0;

  PAGE_SIZE = 10

  //Should match width of "limited" class in stylesheet
  MAX_CHARS = 25

  @ViewChild("studentDown") studentDown: ElementRef;
  @ViewChild("studentUp") studentUp: ElementRef;
  @ViewChild("companyDown") companyDown: ElementRef;
  @ViewChild("companyUp") companyUp: ElementRef;
  @ViewChild("timeDown") timeDown: ElementRef;
  @ViewChild("timeUp") timeUp: ElementRef;

  data = [];

  selectedFair = "";

  careerFairs = [];

  compObjs = [];

  API_URL = "http://epsilon.cs.vt.edu:8080/cs4704/api/"

  //Used in POSTs
  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getCompanies();
  }

  getCompanies(): void {
    this.http.get<Company[]>(this.API_URL+"companies")
      .subscribe(data => {

        this.compObjs = data;
        this.getCareerFairs();
    });;
  }

  getCareerFairs(): void {
    this.http.get<CareerFair[]>(this.API_URL+"careerfairs")
      .subscribe(data => {

        this.cfid = Math.max.apply(Math, data.map(a => a.id));                                         //
        this.selectedFair = data.find(o => o.id === this.cfid).name.toString();
        this.careerFairs = data.map(a => a.name);

        this.getInterviews();
    });;
  }

  getInterviews(): void {
    this.http.get<Interview[]>(this.API_URL+"interviews")
      .subscribe(data => {

        // reset interview table
        this.data = [];
        this.numStudents = 0;
        this.numCompanies = 0;
        this.numInterviews = 0;

        //console.log(this.cfid)
        for (let item of data) {
          //console.log(item);
          // console.log(this === undefined);
          if(item.careerFairID === this.cfid) {

            let companyName = this.compObjs.find(o => o.id === item.companyID).name;

            // increment numStudents/numCompanies if unique
            if (this.data.find(o => o.studentName === item.studentName) === undefined) { this.numStudents++ }
            if (this.data.find(o => o.companyName === companyName) === undefined) { this.numCompanies++ }

            this.data.push({
              // id: item.id,
              // name: item.studentName,
              // company: companyName,
              // time: new Date(item.date.toString() + 'T' + item.time.toString())

              id: item.id,
              studentIDNumber: item.studentIDNumber,
              studentName: item.studentName,
              companyID: item.companyID,
              date: item.date,
              time: item.time,
              careerFairID: this.cfid,

              // new fields for display purposes
              companyName: companyName,
              timeString: new Date(item.date.toString() + 'T' + item.time.toString())
            });
          }
        }

        this.numInterviews = this.data.length
    });;
  }

  deleteFair(): void {

    console.log(this.selectedFair);
    console.log(this.careerFairs);

    // leave interviews from this careerfair, but mark careerFairID as -1
    console.log(this.data);
    for (let interview of this.data) {
      // will return error?
    }

    // delete careerfair
    this.http.delete(this.API_URL+"careerfairs/"+this.cfid)
    console.log(this.API_URL+"careerfairs/"+this.cfid);
    this.careerFairs.splice(this.careerFairs.indexOf(this.selectedFair), 1);
    this.ngOnInit();
  }

  // event passed when a new fair is added
  // call addFair with value of form
  addFairHandler(event: any) {
    // confirm fair doesn't exist
    event.preventDefault();
    let newfair = (<HTMLInputElement>document.getElementById("addFairInput")).value.trim()
    //console.log(newfair);
    if (this.careerFairs.includes(newfair)) {
      alert('Please use a unique name for the new career fair.')
      return;
    }
    this.addFair(newfair);
  }

  addFair(newfair: string) {

    let nfobj = {
      name: newfair,
      numberOfCompanies: 0,
      numberOfStudents: 0,
      numberOfInterviews: 0
    }

    console.log(nfobj)

    this.http.post(this.API_URL+"careerfairs", JSON.stringify(nfobj), this.options)
      .subscribe();

    this.ngOnInit();
  }

  // event passed when a different career fair is selected from dropdown menu
  // call changeFair with value of selected option
  selectFairHandler(event: any) {
    this.changeFair(event.target.value);
  }

  changeFair(choice: string){

    //console.log(choice);

    this.selectedFair = choice
    this.cfid = this.careerFairs.indexOf(choice) + 1;

    this.getInterviews();
  }

  sort(index: Number, isAscending: Boolean){
    let studentEnable = (index == 1)
    let companyEnable = (index == 2)
    let timeEnable = (index == 3)

    if (!isAscending){
      if (studentEnable){
        this.data.sort(function(a, b){
            return a.studentName.localeCompare(b.studentName)
        })
      }
      else if (companyEnable){
        this.data.sort(function(a, b){
            return a.companyName.localeCompare(b.companyName)
        })
      }
      else {
        this.data.sort(function(a, b){
            return a.timeString.valueOf() < b.timeString.valueOf() ? 1 : -1
        })
      }
    }
    if (isAscending){
      if (studentEnable){
        this.data.sort(function(a, b){
          return -1*(a.studentName.localeCompare(b.studentName))
        })
      }
      else if (companyEnable){
        this.data.sort(function(a, b){
            return -1*(a.companyName.localeCompare(b.companyName))
        })
      }
      else {
        this.data.sort(function(a, b){
            return -1*(a.timeString.valueOf() < b.timeString.valueOf() ? 1 : -1)
        })
      }
    }

    this.studentDown.nativeElement.hidden = isAscending && studentEnable
    this.studentUp.nativeElement.hidden = !isAscending || !studentEnable
    this.companyDown.nativeElement.hidden = isAscending && companyEnable
    this.companyUp.nativeElement.hidden = !isAscending || !companyEnable
    this.timeDown.nativeElement.hidden = isAscending && timeEnable
    this.timeUp.nativeElement.hidden = !isAscending || !timeEnable

    this.studentDown.nativeElement.className = studentEnable ? "active" : "inactive"
    this.studentUp.nativeElement.className = studentEnable ? "active" : "inactive"
    this.companyDown.nativeElement.className = companyEnable ? "active" : "inactive"
    this.companyUp.nativeElement.className = companyEnable ? "active" : "inactive"
    this.timeDown.nativeElement.className = timeEnable ? "active" : "inactive"
    this.timeUp.nativeElement.className = timeEnable ? "active" : "inactive"
  }

  paginate(page: number): void{
    if (page < 0){
      page = 0
    }
    let max_page = Math.floor(this.data.length/this.PAGE_SIZE)
    if (max_page % this.PAGE_SIZE == 0){
      page = max_page-1
    }
    if (page > max_page){
      page = max_page
    }
    this.curPage = page
  }

  pages() {
    let result = this.data.length / this.PAGE_SIZE
    result = Math.floor(result)+1
    return Array(result);
  }



}
