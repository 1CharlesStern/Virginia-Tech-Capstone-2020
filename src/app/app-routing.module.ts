import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from './admin/admin.guard';
import { StudentComponent } from './student/student.component';
import { CompanyComponent } from './company/company.component';
import { LoginComponent } from './login/login.component';
import { MasterlistComponent } from './admin/masterlist/masterlist.component';
import { StatsComponent } from './admin/stats/stats.component';


const routes: Routes = [{
    path: 'admin',
    component: AdminComponent,
    children:
    [
      {path: '', redirectTo: 'stats', pathMatch: 'full'},
      {path: 'stats', component:StatsComponent},
      {path: 'masterlist', component:MasterlistComponent}
    ],
    canActivate: [AdminGuard],
    canActivateChild: [AdminGuard],
  },
  {path: '', component:StudentComponent},
  {path: 'company', component:CompanyComponent},
  {path: 'company/:id', component:CompanyComponent},
  {path: 'login', component:LoginComponent},
  {path: '**', redirectTo: ''}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
