import { AuthGuard } from './services/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessagesComponent } from './messages/messages.component';


const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
  {path: 'message', component: MessagesComponent, canActivate:[AuthGuard]},
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
