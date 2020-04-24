import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  view: CalendarView = CalendarView.Day;

  viewDate = new Date("March 30 2020");

  dateFormat = 'MMM d, y, h:mm a'

  id = null

  data = []

  events = []

  CALENDAR_HOUR_START = 7
  CALENDAR_HOUR_END = 20

  ngOnInit(): void {
    this.id = this.getInterviews(this.route.snapshot.paramMap.get('id'))
    this.events = this.populateEvents(this.data)
  }

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }

  populateEvents(eventData): CalendarEvent[]{
    let result: CalendarEvent[] = []
    for (let entry of eventData){
      let event: CalendarEvent =
      {
        title: entry.name,
        start: entry.time,
      }
      result.push(event)
    }
    return result
  }

  navigateToCompany(){
    let obj = (<HTMLInputElement>document.getElementById("companyInput")).value;
    if (obj){
      this.router.navigate([obj], {relativeTo: this.route});
    }
  }

  getInterviews(id: String){
    // I am not entirely sure this works. I could not test via the client. - Andrew
    // NOTE UNTESTED CODE: PROBABLY DOESN'T WORK BUT THE UNDERLYING LOGIC SHOULD BE CORRECT

    //TODO confirm "id" points to a valid Company
    //If "id" is invalid return null

    //TODO fetch the interviews for the company with ID = "id"

    this.http.get('http://localhost:8080/api/interviews').subscribe(result => {
      var lastWeekInterviews = (<any[]>result).filter(function (interview) {
        //gets the date from the interview.
        var range = new Date(interview.date);

        var temp = new Date();
        //604800000 is equal to one week
        var lastweek = new Date(temp.valueOf() - 604800000);

        // returns the json objects that are within the last seven days.
        return (range >= lastweek);
      });

      // prunes the list.
      var prunedData = lastWeekInterviews.map(o => {
        let obj = Object.assign({}, o);
        delete obj.StudentIDNumber;
        delete obj.companyID
        delete obj.careerfairID
        return obj;
      });

      this.data = prunedData
    })

    // since the data is stored in two date time formats in the json object.
    // I am not really sure how your widget works. The json objects in the code above SHOULD
    // have an object with the studentName, a date key in yyyy-mm--dd format, and a time key.
    // example: [{studentName: "bob", Date:"1999-11-11", time: "00:00:00"}]

  }

}
