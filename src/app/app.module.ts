import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatIconModule,
  MatNativeDateModule,
  MatFormFieldModule,
  MatCardModule,
  MatSnackBarModule,
  MatInputModule,
  MatAutocompleteModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatSelectModule
} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthService } from './services/auth/auth.service';
import { AuthGuard } from './services/auth/auth-guard.service';
import { SignInComponent } from './sign-in/sign-in.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AddMealComponent } from './add-meal/add-meal.component';
import { OverviewComponent } from './overview/overview.component';
import { MyDayComponent } from './my-day/my-day.component';
import { AddIngredientComponent } from './add-ingredient/add-ingredient.component';
import { MealService } from './services/meal/meal.service';
import { IngredientService } from './services/ingredient/ingredient.service';
import { UserService } from './services/user/user.service';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    ToolbarComponent,
    ProfileComponent,
    SignInComponent,
    AddMealComponent,
    OverviewComponent,
    MyDayComponent,
    AddIngredientComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatCardModule,
    HttpClientModule,
    MatInputModule,
    AngularFireDatabaseModule,
    MatSnackBarModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatIconModule,
    MatSelectModule,
    AngularFireModule.initializeApp(environment.firebase),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    AuthService,
    AuthGuard,
    MealService,
    IngredientService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
