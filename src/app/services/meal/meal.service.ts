import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, BehaviorSubject, Subscribable, Subscription } from 'rxjs';
import { Meal } from 'src/app/models/meal.interface';
import { AuthService } from '../auth/auth.service';
import { DayMeal } from 'src/app/models/day-meal.interface';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MealService {
  selectedDateMeal$ = new BehaviorSubject<DayMeal[]>([]);
  s: Subscription;
  selDate: Date;
  get selectedDate(): Date {
    return this.selDate;
  }
  set selectedDate(d: Date) {
    this.selDate = d;
    if (this.s) {
      this.s.unsubscribe();
    }
    this. s = this.getMyMealsOnDate(d).subscribe(v => this.selectedDateMeal$.next(v));
  }

  constructor(private db: AngularFireDatabase, private auth: AuthService, private datePipe: DatePipe) {
    this.selectedDate = new Date();
  }

  getMeals(): Observable<Meal[]> {
    return this.db.list(`users/${this.auth.currentUser.uid}/meals`).valueChanges() as Observable<Meal[]>;
  }

  getMyMealsOnDate(date: Date = this.selectedDate): Observable<DayMeal[]> {
    const d = this.datePipe.transform(date, 'dd-MM-yyyy');
    return this.db.list(`users/${this.auth.currentUser.uid}/daymeals/${d}`).valueChanges() as Observable<DayMeal[]>;
  }

  async addMeal(meal: Meal): Promise<any> {
    return this.db.list(`users/${this.auth.currentUser.uid}/meals`).push(meal);
  }

  async addMealOnDate(meal: DayMeal, date: Date = this.selectedDate): Promise<any> {
    const d = this.datePipe.transform(date, 'dd-MM-yyyy');
    const m = {
      ...meal,
      uid: this.db.createPushId()
    };
    return this.db.object(`users/${this.auth.currentUser.uid}/daymeals/${d}/${m.uid}`).set(m);
  }

  async removeMealOnDate(meal: DayMeal, date: Date = this.selectedDate): Promise<any> {
    const d = this.datePipe.transform(date, 'dd-MM-yyyy');
    return this.db.object(`users/${this.auth.currentUser.uid}/daymeals/${d}/${meal.uid}`).remove();
  }
}
