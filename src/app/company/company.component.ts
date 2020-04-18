import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  view: CalendarView = CalendarView.Day;

  viewDate = new Date("March 30 2020");

  data = [
    {name: "Bob Jones", time: new Date("March 30 2020 1:41 PM")},
    {name: "Mary Phillips", time: new Date("March 30 2020 1:35 PM")},
    {name: "Joe Rogan", time: new Date("March 30 2020 1:00 PM")},
    {name: "Jeff Bezos", time: new Date("March 30 2020 11:55 AM")},
    {name: "Stevie Wonder", time: new Date("March 29 2020 2:00 PM")}
  ]

  events = this.populateEvents(this.data)

  CALENDAR_HOUR_START = 7
  CALENDAR_HOUR_END = 20

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

}
