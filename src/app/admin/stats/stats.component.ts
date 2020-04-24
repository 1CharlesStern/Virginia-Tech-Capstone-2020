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

  constructor(private http: HttpClient) { }

  getCompanies(): void {
    this.http.get<Company[]>("http://localhost:8080/api/companies.json") // testing
      //.map(data => _.values(data))                                            //
      .subscribe(data => {                                                    //

        this.compObjs = data;
    });;
  }

  getCareerFairs(): void {
    this.http.get<CareerFair[]>("http://localhost:8080/api/careerfairs.json") // testing
      //.map(data => _.values(data))                                            //
      .subscribe(data => {                                                    //

        this.cfid = Math.max.apply(Math, data.map(a => a.id));                                         //
        this.selectedFair = data.find(o => o.id === this.cfid).id.toString();
        this.careerFairs = data.map(a => a.name);
    });;
  }

  getInterviews(): void {
    this.http.get<Interview[]>("http://localhost:8080/api/interviews.json") // testing
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

        this.numInterviews = this.data.length                                   //
    });;
  }

  deleteFair(): void {
    this.http.delete("http://localhost:8080/api/careerfairs.json"+this.selectedFair) //testing
  }

  ngOnInit(): void {
    this.getCompanies();
    this.getCareerFairs();
    this.getInterviews();
  }



  sort(index: Number, isAscending: Boolean){
    //TODO sorting


    let studentEnable = (index == 1)
    let companyEnable = (index == 2)
    let timeEnable = (index == 3)

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

  changeFair(choice: string){
    this.selectedFair = choice
  }

}
