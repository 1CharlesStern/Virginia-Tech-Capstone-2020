import { Component, OnInit, ViewChild, ElementRef, Injectable } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-masterlist',
  templateUrl: './masterlist.component.html',
  styleUrls: ['./masterlist.component.css']
})
@Injectable()
export class MasterlistComponent implements OnInit {

  ascendingSort = true

  constructor(private service: AdminService) { }

  ngOnInit(): void {
    this.getCompanies()
  }
  //Limits number of items on one page
  PAGE_SIZE = 8;

  curPage = 0;
  maxPages = 0;
  pageOffset = 0;

  data = []

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
  /*
    Sorts data.  Data can be sorted in two directions (up down)
  */
  sort() {
    if (this.ascendingSort){
      this.data.sort(function(a, b){
         return a.name.localeCompare(b.name)
      })
    }
    else {
      this.data.sort(function(a, b){
         return -1*(a.name.localeCompare(b.name))
      })
    }
  }

  /*
    Requests a list of all Companies from the Admin service
  */
  getCompanies(): void {
    this.service.getCompaniesHTTP().subscribe(
      result => {
        this.data = result
        this.sort()
      }
    )
  }

  /*
    Requests a Company to be removed by the Admin service
  */
  dropCompany(index: number): void {
    if (confirm("Are you sure?")){
      this.service.dropCompanyHTTP(this.data[index]["id"]).subscribe(_ => this.getCompanies())
    }
  }

  /*
    Requests a Company to be added by the Admin service
  */
  addCompany(name: string) {
    this.service.addCompanyHTTP(name).subscribe(_ => this.getCompanies())
  }
}
