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

  checkAuth(pwd: any){
    this.service.submitLogin(pwd.value).subscribe(
      data => {
        if (data){
          localStorage.set('token', data)
          //TODO token expiration
          this.router.navigate(['/admin'])
        }
        else {
          this.router.navigate([''])
        }
      },
      error => {
        this.router.navigate([''])
      }
    )
  }

}
