import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-masterlist',
  templateUrl: './masterlist.component.html',
  styleUrls: ['./masterlist.component.css']
})
export class MasterlistComponent implements OnInit {

  @ViewChild("down") down: ElementRef;
  @ViewChild("up") up: ElementRef;

  ascendingSort = false

  constructor() { }

  ngOnInit(): void {
  }

  data = [
    {name: "General Electric", inFair: true},
    {name: "Toshiba", inFair: true},
    {name: "Cisco", inFair: true},
    {name: "Google", inFair: true},
    {name: "Facebook", inFair: true},
    {name: "Amazon", inFair: true},
  ]

}
