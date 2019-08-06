import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './services/auth/auth-guard.service';
import { SignInComponent } from './sign-in/sign-in.component';
import { AddMealComponent } from './add-meal/add-meal.component';
import { OverviewComponent } from './overview/overview.component';
import { AddIngredientComponent } from './add-ingredient/add-ingredient.component';
import { PkuConverterComponent } from './pku-converter/pku-converter.component';
import { PrintComponent } from './print/print.component';
import { MyDayComponent } from './my-day/my-day.component';

const routes: Routes = [
  // { path: 'overview', pathMatch: 'full', component: OverviewComponent, canActivate: [AuthGuard] },
  { path: 'myday', pathMatch: 'full', component: MyDayComponent, canActivate: [AuthGuard] },
  { path: 'convert', pathMatch: 'full', component: PkuConverterComponent, canActivate: [AuthGuard] },
  { path: 'profile', pathMatch: 'full', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'print', pathMatch: 'full', component: PrintComponent, canActivate: [AuthGuard] },
  { path: 'meal', pathMatch: 'full', component: AddMealComponent, canActivate: [AuthGuard] },
  { path: 'ingredient', pathMatch: 'full', component: AddIngredientComponent, canActivate: [AuthGuard] },
  { path: 'login', pathMatch: 'full', component: SignInComponent },
  { path: '**', redirectTo: 'myday' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
