import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';  //

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

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  numStudents = 100
  numInterviews = 300
  numCompanies = 50

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

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getCompanies();
  }

  getCompanies(): void {
    this.http.get<Company[]>(this.API_URL+"companies") // testing
      //.map(data => _.values(data))                                            //
      .subscribe(data => {                                                    //

        this.compObjs = data;
        this.getCareerFairs();
    });;
  }

  getCareerFairs(): void {
    this.http.get<CareerFair[]>(this.API_URL+"careerfairs") // testing
      //.map(data => _.values(data))                                            //
      .subscribe(data => {                                                    //

        this.cfid = Math.max.apply(Math, data.map(a => a.id));                                         //
        this.selectedFair = data.find(o => o.id === this.cfid).id.toString();
        this.careerFairs = data.map(a => a.name);

        this.getInterviews();
    });;
  }

  getInterviews(): void {
    this.http.get<Interview[]>(this.API_URL+"interviews") // testing
      //.map(data => _.values(data))                                            //
      .subscribe(data => {

        this.numStudents = 0;
        this.numCompanies = 0;                                             //

        for (let item of data) {
          console.log(item);
          console.log(this === undefined);
          if(item.careerFairID === this.cfid) {

            let companyName = this.compObjs.find(o => o.id === item.companyID).name;

            // increment numStudents/numCompanies if unique
            if (this.data.find(o => o.name === item.studentName) === undefined) { this.numStudents++ }
            if (this.data.find(o => o.company === companyName) === undefined) { this.numCompanies++ }

            this.data.push({
              name: item.studentName,
              company: companyName,
              time: new Date(item.date.toString() + 'T' + item.time.toString())
            });
          }
        }

        this.numInterviews = this.data.length
                                           //
    });;
  }

  deleteFair(): void {
    this.http.delete(this.API_URL+"careerfairs/"+this.selectedFair) //testing
    this.careerFairs.splice(this.careerFairs.indexOf(this.selectedFair), 1);
    this.ngOnInit();
  }

  sort(index: Number, isAscending: Boolean){
    let studentEnable = (index == 1)
    let companyEnable = (index == 2)
    let timeEnable = (index == 3)

    if (!isAscending){
      if (studentEnable){
        this.data.sort(function(a, b){
            return a.name.localeCompare(b.name)
        })
      }
      else if (companyEnable){
        this.data.sort(function(a, b){
            return a.company.localeCompare(b.company)
        })
      }
      else {
        this.data.sort(function(a, b){
            return a.time.valueOf() < b.time.valueOf() ? 1 : -1
        })
      }
    }
    if (isAscending){
      if (studentEnable){
        this.data.sort(function(a, b){
          return -1*(a.name.localeCompare(b.name))
        })
      }
      else if (companyEnable){
        this.data.sort(function(a, b){
            return -1*(a.company.localeCompare(b.company))
        })
      }
      else {
        this.data.sort(function(a, b){
            return -1*(a.time.valueOf() < b.time.valueOf() ? 1 : -1)
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

  changeFair(choice: string){
    this.selectedFair = choice
    this.cfid = this.careerFairs.indexOf(choice) + 1;

    this.getInterviews();
  }

}
