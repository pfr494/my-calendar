import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './services/auth/auth-guard.service';
import { SignInComponent } from './sign-in/sign-in.component';

const routes: Routes = [
  { path: 'calendar', pathMatch: 'full', component: CalendarComponent, canActivate: [AuthGuard] },
  { path: 'profile', pathMatch: 'full', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'login', pathMatch: 'full', component: SignInComponent },
  { path: '**', redirectTo: 'calendar' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
