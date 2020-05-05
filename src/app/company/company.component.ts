import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  view: CalendarView = CalendarView.Day;

  viewDate = new Date();

  dateFormat = 'MMM d, y, h:mm a'

  id = null
  companyData = null

  data = []

  events = []

  CALENDAR_HOUR_START = 7
  CALENDAR_HOUR_END = 20

  API_URL = environment.apiUrl

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')
    if (this.id){
      this.getCompanies()
    }
  }

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }

  populateEvents(eventData): CalendarEvent[]{
    let result: CalendarEvent[] = []
    for (let entry of eventData){
      let event: CalendarEvent =
      {
        title: entry.studentName,
        start: new Date(entry.date + " " + entry.time)
      }
      result.push(event)
    }
    debugger;
    return result
  }

  navigateToCompany(){
    let obj = (<HTMLInputElement>document.getElementById("companyInput")).value;
    if (obj){
      this.id = obj
      this.router.navigate(['/company', obj])
    }
    else {
      this.id = this.route.snapshot.paramMap.get('id')
    }
    if (this.id){
      this.getCompanies()
    }
  }

  getInterviews(){
    this.http.get(this.API_URL+'interviews').subscribe(result => {
      var lastWeekInterviews = (<any[]>result).filter(function (interview) {
        //gets the date from the interview.
        var range = new Date(interview.date);

        var temp = new Date();
        //604800000 is equal to one week
        var lastweek = new Date(temp.valueOf() - 604800000);

        // returns the json objects that are within the last seven days.
        return (range >= lastweek && interview.companyID == this.companyData.id);
      }, this);

      // prunes the list.
      var prunedData = lastWeekInterviews.map(o => {
        let obj = Object.assign({}, o);
        delete obj.StudentIDNumber;
        delete obj.companyID
        delete obj.careerfairID
        return obj;
      });

      this.data = prunedData.sort((a, b) => a.date+a.time > b.date+b.time ? 1 : -1).reverse()
      this.events = this.populateEvents(this.data)
    })

    // since the data is stored in two date time formats in the json object.
    // I am not really sure how your widget works. The json objects in the code above SHOULD
    // have an object with the studentName, a date key in yyyy-mm--dd format, and a time key.
    // example: [{studentName: "bob", Date:"1999-11-11", time: "00:00:00"}]

  }

  getCompanies(){
    this.http.get(this.API_URL+'companies').subscribe(result => {
      this.companyData = (<any[]>result).filter(interview => interview.url == this.id)[0]
      if (this.companyData){
        this.getInterviews()
      }
    })
  }

}
