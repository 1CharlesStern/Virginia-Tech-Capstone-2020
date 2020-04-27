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

  PAGE_SIZE = 8;

  curPage = 0;

  data = [
    /*
    example: {
    "id" : 4,
    "name" : "company",
    "url" : "http://epsilon.cs.vt.edu/company/y42fp",
    "interviews" : []
  }*/
  ]

  paginate(page: number): void{
    if (page < 0){
      page = 0
    }
    let max_page = Math.floor(this.data.length/this.PAGE_SIZE)
    if (max_page % this.PAGE_SIZE == 0){
      max_page--
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

  getCompanies(): void {
    this.service.getCompaniesHTTP().subscribe(
      result => {
        this.data = result
        this.sort()
      }
    )
  }

  dropCompany(index: number): void {
    if (confirm("Are you sure?")){
      this.service.dropCompanyHTTP(this.data[index]["id"]).subscribe(_ => this.getCompanies())
    }
  }

  addCompany(name: string) {
    this.service.addCompanyHTTP(name).subscribe(_ => this.getCompanies())
  }
}
