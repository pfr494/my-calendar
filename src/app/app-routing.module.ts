import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './services/auth/auth-guard.service';
import { SignInComponent } from './sign-in/sign-in.component';
import { AddMealComponent } from './add-meal/add-meal.component';
import { OverviewComponent } from './overview/overview.component';
import { AddIngredientComponent } from './add-ingredient/add-ingredient.component';
import { PkuConverterComponent } from './pku-converter/pku-converter.component';

const routes: Routes = [
  { path: 'overview', pathMatch: 'full', component: OverviewComponent, canActivate: [AuthGuard], data: { state: 'home' } },
  { path: 'convert', pathMatch: 'full', component: PkuConverterComponent, canActivate: [AuthGuard], data: { state: 'home' } },
  { path: 'profile', pathMatch: 'full', component: ProfileComponent, canActivate: [AuthGuard], data: { state: 'away' } },
  { path: 'meal', pathMatch: 'full', component: AddMealComponent, canActivate: [AuthGuard], data: { state: 'away' } },
  { path: 'ingredient', pathMatch: 'full', component: AddIngredientComponent, canActivate: [AuthGuard], data: { state: 'away'} },
  { path: 'login', pathMatch: 'full', component: SignInComponent },
  { path: '**', redirectTo: 'overview' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
