import { Component, OnInit, ViewChild, ElementRef, Injectable } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-masterlist',
  templateUrl: './masterlist.component.html',
  styleUrls: ['./masterlist.component.css']
})
@Injectable()
export class MasterlistComponent implements OnInit {

  ascendingSort = false

  constructor(private service: AdminService) { }

  ngOnInit(): void {
    this.getCompanies()
  }

  PAGE_SIZE = 8;

  curPage = 0;

  data = [
    {name: "General Electric", url: ""},
    {name: "Toshiba", url: ""},
    {name: "Cisco", url: ""},
    {name: "Google", url: ""},
    {name: "Facebook", url: ""},
    {name: "Amazon", url: ""},
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

  getCompanies(): void {
    this.service.getCompaniesHTTP().subscribe(
      result => this.data = result
    )
  }

  dropCompany(id: string): void {
    if (confirm("Are you sure?")){
      this.service.dropCompanyHTTP(id).subscribe(_ => this.getCompanies())
    }
  }

  addCompany(name: string) {
    this.service.addCompanyHTTP(name).subscribe(_ => this.getCompanies())
  }
}
