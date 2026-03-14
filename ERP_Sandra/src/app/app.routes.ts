import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Landing } from './pages/landing/landing';
import { UserManagement } from './pages/user-management/user-management';
import { GroupManagement } from './pages/group-management/group-management';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'landing', component: Landing },
  { path: 'user-management', component: UserManagement },
  { path: 'group-management', component: GroupManagement },
  { path: '**', redirectTo: 'login' }
];
