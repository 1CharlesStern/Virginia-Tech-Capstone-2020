import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment'

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

  curPage = 0;
  maxPages = 0;
  pageOffset = 0;

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

  API_URL = environment.apiUrl

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

  /*
    Sends a GET request to the server that retrieves all companies
  */
  getCompanies(): void {
    this.http.get<Company[]>(this.API_URL+"companies")
      .subscribe(data => {

        this.compObjs = data;
        this.getCareerFairs();
    });;
  }
  /*
    Sends a GET request to the server that retrieves all career fairs
  */
  getCareerFairs(): void {
    this.http.get<CareerFair[]>(this.API_URL+"careerfairs")
      .subscribe(data => {
        this.cfid = Math.max.apply(Math, data.map(a => a.id));                                         //
        this.selectedFair = data.find(o => o.id === this.cfid).name.toString();
        this.careerFairs = data.reverse();

        this.getInterviews();
    });;
  }
  /*
    Sends a GET request to the server that retrieves all interviews
    Also populates local arrays used to display data
  */
  getInterviews(): void {
    this.http.get<Interview[]>(this.API_URL+"interviews")
      .subscribe(data => {

        // reset interview table
        this.data = [];
        this.numStudents = 0;
        this.numCompanies = 0;
        this.numInterviews = 0;

        for (let item of data) {
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

  /*
    Event passed when a new fair is added
    Runs validation to ensure there are no duplicates
  */
  addFairHandler(event: any) {
    event.preventDefault();
    let newfair = (<HTMLInputElement>document.getElementById("addFairInput")).value.trim()
    if (this.careerFairs.find(elem => elem.name == newfair)) {
      alert('Please use a unique name for the new career fair.')
      return;
    }
    this.addFair(newfair);
  }

  /*
    Sends a new CareerFair in a POST to the server
    Then fetches new data
  */
  addFair(newfair: string) {

    let nfobj = {
      name: newfair,
      numberOfCompanies: 0,
      numberOfStudents: 0,
      numberOfInterviews: 0
    }

    this.http.post(this.API_URL+"careerfairs", JSON.stringify(nfobj), this.options)
      .subscribe();

    this.getCompanies();
  }

  /*
    Event passed when a different career fair is selected
  */
  selectFairHandler(event: any) {
    this.changeFair(event.target.value);
  }

  /*
    Changes the active career fair
    Then fetches new data
  */
  changeFair(choice: string){

    this.selectedFair = choice
    this.cfid = this.careerFairs.find(elem => elem.name == choice).id

    this.getInterviews();
  }

  /*
    Sorts data.  Data can be sorted in two directions, (up down)
    using one of three sort options (name, company, time)
  */
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

  /*
    Controls the paging buttons
  */
  paginate(page: number): void{
    if (page < 0){
      page = 0
    }
    this.maxPages = Math.floor(this.data.length/this.PAGE_SIZE)
    if (this.data.length % this.PAGE_SIZE == 0){
      page = this.maxPages-1
    }
    if (page > this.maxPages){
      page = this.maxPages
    }
    this.curPage = page
    this.pages()
  }
  /*
    Initializes the paging buttons
  */
  pages() {
    let result = Math.floor(this.data.length / this.PAGE_SIZE)
    if  (this.data.length % this.PAGE_SIZE != 0){
      result = result+1
    }

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



}
