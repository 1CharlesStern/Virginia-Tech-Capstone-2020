import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  //Requires "username", "password" JSON object
  AUTH_API = 'http://localhost:8080/api/users'

  checkAuth(pwd: string){
    //TODO http post to auth backend
    let todo = true
    let token = "todo"
    if (todo){
      localStorage.setItem('token', token)
    }
  }

}
