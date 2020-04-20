import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

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

  events = this.populateEvents(this.data)

  CALENDAR_HOUR_START = 7
  CALENDAR_HOUR_END = 20

  ngOnInit(): void {
    this.id = this.getInterviews(this.route.snapshot.paramMap.get('id'))
  }

  constructor(private route: ActivatedRoute, private router: Router) { }

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
    //TODO confirm "id" points to a valid Company
    //If "id" is invalid return null

    //TODO fetch the interviews for the company with ID = "id"
    this.data = [
      {name: "Bob Jones", time: new Date("March 30 2020 1:41 PM")},
      {name: "Mary Phillips", time: new Date("March 30 2020 1:35 PM")},
      {name: "Joe Rogan", time: new Date("March 30 2020 1:00 PM")},
      {name: "Jeff Bezos", time: new Date("March 30 2020 11:55 AM")},
      {name: "Stevie Wonder", time: new Date("March 29 2020 2:00 PM")}
    ]
    return id
  }

}
