import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'test-app';

  showAdmin = true
  showStudent = true
  showCompany = true
  showUp = false
  showDown = true

  constructor(public router: Router){

  }

  //Compares a given path with the current url
  //Discards child paths
  testRoute(path: String){
    let trimRoute = this.router.url.substring(0, path.length)
    return trimRoute == path
  }

  hide(){
    this.showAdmin = false
    this.showStudent = false
    this.showCompany = false
    this.showDown = false
    this.showUp = true
  }

  unhide(){
    this.showAdmin = true
    this.showStudent = true
    this.showCompany = true
    this.showDown = true
    this.showUp = false
  }
}
