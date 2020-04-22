import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { StudentComponent, StudentComponentDialog } from './student/student.component';
import { CompanyComponent } from './company/company.component';
import { LoginComponent } from './login/login.component';
import { MasterlistComponent } from './admin/masterlist/masterlist.component';
import { TruncatePipe } from './truncate.pipe';
import { StatsComponent } from './admin/stats/stats.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';

import { JwtHelperService } from '@auth0/angular-jwt';


export function momentAdapterFactory() {
  return adapterFactory(moment);
};

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    StudentComponent,
    CompanyComponent,
    LoginComponent,
    MasterlistComponent,
    StatsComponent,
    StudentComponentDialog,
    TruncatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatIconModule,
    ScrollingModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: momentAdapterFactory }),
    MatDialogModule,
    MatMenuModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        ...new MatDialogConfig(),
        minWidth: '450px',
        minHeight: '200px',
      } as MatDialogConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
