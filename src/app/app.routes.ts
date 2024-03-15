import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { securityInnerGuard } from './core/security-inner.guard';
import {ChatComponent} from "./chat/chat.component";
import {HomeComponent} from "./home/home.component";

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component:HomeComponent},
    { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
    { path: 'user', component: UserComponent, canActivate: [securityInnerGuard] },
    { path: 'chat',  loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule), canActivate: [securityInnerGuard]},
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
