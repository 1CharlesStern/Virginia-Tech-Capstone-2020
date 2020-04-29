import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable } from "rxjs";

/*
  Adds the "Authorization" header to every request, so that
  trusted users can access the admin-only API commands.
*/
@Injectable()
export class AdminInterceptor implements HttpInterceptor {
  constructor() { }
  //function which will be called for all http calls
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //updates the request parameters
    let token = localStorage.getItem('token')
    let updatedRequest = request
    if (token){
      updatedRequest = request.clone({
        headers: request.headers.set("Authorization", token)
      });
    }
    //sends the request to its destination
    return next.handle(updatedRequest).pipe();
  }
}
