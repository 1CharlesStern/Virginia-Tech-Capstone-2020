import { Component, OnInit } from '@angular/core';
import { sha256 } from 'js-sha256';
import { Router } from '@angular/router';
import { AdminService } from '../admin/admin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private service: AdminService, private router: Router) { }

  ngOnInit(): void {
  }

  EXPIRATION = 7 * 24 * 60 * 60 * 1000 //One week, in ms

  checkAuth(pwd: any){
    localStorage.setItem('expiration', (new Date(new Date().valueOf() + this.EXPIRATION)).valueOf().toString())
    this.router.navigate(['/admin'])
    //TODO enable when login is working
    /*this.service.submitLogin(pwd.value).subscribe(
      data => {
        if (data){
          localStorage.setItem('token', data)
          localStorage.setItem('expiration', (new Date(new Date().valueOf() + EXPIRATION)).valueOf().toString())
          this.router.navigate(['/admin'])
        }
        else {
          this.router.navigate([''])
        }
      },
      error => {
        this.router.navigate([''])
      }
    )*/
  }

}
