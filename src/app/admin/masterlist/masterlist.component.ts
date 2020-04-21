import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-masterlist',
  templateUrl: './masterlist.component.html',
  styleUrls: ['./masterlist.component.css']
})
export class MasterlistComponent implements OnInit {

  ascendingSort = false

  constructor() { }

  ngOnInit(): void {
  }

  PAGE_SIZE = 8;

  curPage = 0;

  data = [
    {name: "General Electric", inFair: true},
    {name: "Toshiba", inFair: true},
    {name: "Cisco", inFair: true},
    {name: "Google", inFair: true},
    {name: "Facebook", inFair: true},
    {name: "Amazon", inFair: true},
  ]

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

  dropCompany(): void {
    //TODO
  }

  addCompany(): void {
    //TODO
  }

  editCompany(): void {
    //TODO
  }

}
