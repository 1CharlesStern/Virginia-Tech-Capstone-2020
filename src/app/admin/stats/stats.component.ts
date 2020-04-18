import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  numStudents = 100
  numInterviews = 300
  numCompanies = 50

  //Should match width of "limited" class in stylesheet
  MAX_CHARS = 25

  @ViewChild("studentDown") studentDown: ElementRef;
  @ViewChild("studentUp") studentUp: ElementRef;
  @ViewChild("companyDown") companyDown: ElementRef;
  @ViewChild("companyUp") companyUp: ElementRef;
  @ViewChild("timeDown") timeDown: ElementRef;
  @ViewChild("timeUp") timeUp: ElementRef;

  data = [
    {name: "Bob Jones", company: "General Electric", time: new Date("March 30 2020 1:41 PM")},
    {name: "Mary Phillips", company: "General Electric", time: new Date("March 30 2020 1:35 PM")},
    {name: "Joe Rogan", company: "General Electric", time: new Date("March 30 2020 1:00 PM")},
    {name: "Jeff Bezos", company: "General Electric", time: new Date("March 30 2020 11:55 AM")},
    {name: "Stevie Wonder", company: "General Electric", time: new Date("March 29 2020 2:00 PM")}
  ]

  constructor() { }

  ngOnInit(): void {
  }

  formatDate(date: Date){
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var minuteString = minutes < 10 ? '0'+minutes.toString() : minutes.toString();
    var strTime = hours + ':' + minuteString + ' ' + ampm;
    var readableDate = date.toDateString()
    readableDate = readableDate.substring(0, readableDate.length-4)
    return readableDate+" "+strTime;
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

}
