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

  getCompanies(): void {
    this.service.getCompaniesHTTP().subscribe(data =>
      console.log(data))
  }

  dropCompany(id: string): void {
    if (confirm("Are you sure?")){
      this.service.dropCompanyHTTP(id).subscribe(data => console.log(data))
    }
  }

  addCompany(name: string) {
    this.service.addCompanyHTTP(name).subscribe(data => console.log(data))
  }
}
