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

  failure = false
  EXPIRATION = 7 * 24 * 60 * 60 * 1000 //One week, in ms

  checkAuth(pwd: any){
    this.service.submitLogin(pwd.value).subscribe(
      resp => {
        if (resp){
          localStorage.setItem('token', resp.headers.get('Authorization'))
          console.log(resp.headers.get('Authorization'))
          localStorage.setItem('expiration', (new Date(new Date().valueOf() + this.EXPIRATION)).valueOf().toString())
          this.router.navigate(['/admin'])
        }
        else {
          this.router.navigate([''])
        }
      },
      error => {
        this.failure = true
      }
    )
  }

}
