import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditDaymealComponent } from './my-day/edit-daymeal/edit-daymeal.component';
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
  MatSelectModule,
  MatExpansionModule,
  MatSidenavModule,
  MAT_DATE_FORMATS
} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthService } from './services/auth/auth.service';
import { AuthGuard } from './services/auth/auth-guard.service';
import { AdminGuard } from './services/auth/admin-guard.service';
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
import { DatePipe, registerLocaleData } from '@angular/common';
import { PkuConverterComponent } from './pku-converter/pku-converter.component';
import { UpdaterService } from './services/updater/updater.service';
import localeDa from '@angular/common/locales/da';
import { PrintComponent } from './print/print.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { LoadingComponent } from './loading/loading.component';
import { IngredientQuantityPipe } from './pipes/ingredient-quantity.pipe';
import { DATE_FORMATS } from './config/date-formats';

registerLocaleData(localeDa, 'da');

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
    AddIngredientComponent,
    PkuConverterComponent,
    PrintComponent,
    EditDaymealComponent,
    LoadingComponent,
    IngredientQuantityPipe
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
    MatSnackBarModule,
    MatExpansionModule,
    MatSidenavModule,
    NgxMaterialTimepickerModule,
    AngularFireModule.initializeApp(environment.firebase),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    AuthService,
    AuthGuard,
    AdminGuard,
    MealService,
    IngredientService,
    UserService,
    DatePipe,
    UpdaterService,
    {
      provide: MAT_DATE_FORMATS,
      useValue: DATE_FORMATS
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
