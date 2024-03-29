import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { CalendarComponent } from './calendar/calendar.component';
import { securityInnerGuard } from './core/security-inner.guard';
import {ChatComponent} from "./chat/chat.component";
// import {HomeComponent} from "./home/home.component";
import { DashboardComponent } from './dashboard/dashboard.component';
import { LandingComponent } from './landing/landing.component';

export const routes: Routes = [
    { path: '', redirectTo: 'landing', pathMatch: 'full' },
    // { path: 'home', component:HomeComponent},
    { path: 'dashboard', component:DashboardComponent },
    { path: 'landing', component:LandingComponent },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
    { path: 'user', component: UserComponent, canActivate: [securityInnerGuard] },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
