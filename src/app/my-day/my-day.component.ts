import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Meal } from '../models/meal.interface';
import { UserService } from '../services/user/user.service';
import { Subscription } from 'rxjs';
import { SimpleUser } from '../models/simple-user.interface';
import { MealService } from '../services/meal/meal.service';
import { NgForm } from '@angular/forms';
import { DayMeal } from '../models/day-meal.interface';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-my-day',
  templateUrl: './my-day.component.html',
  styleUrls: ['./my-day.component.scss']
})
export class MyDayComponent implements OnInit, OnDestroy {
  @ViewChild('mealForm', { static: true }) form: NgForm;
  private subs: Subscription[];
  userPkuLimit: number;
  dailyMeals: DayMeal[] = [];
  mealOptions: Meal[] = [];

  quantity: number;
  selectedMeal: Meal;

  loading: boolean;
  mSub: Subscription;

  constructor(private user: UserService, private mealService: MealService, private snack: MatSnackBar) { }

  ngOnInit() {
    this.subs = [
      this.user.getUser().subscribe((u: SimpleUser) => this.userPkuLimit = u.pkuLimit),
      this.mealService.getMeals().subscribe((m: Meal[]) => this.mealOptions = m),
      this.mealService.selectedDateMeal$.subscribe((m: DayMeal[]) => this.dailyMeals = m),
    ];
  }

  ngOnDestroy() {
    for (const s of this.subs) {
      s.unsubscribe();
    }
  }

  addMealOnDate() {
    try {
      this.loading = true;
      const m = {
        meal: this.selectedMeal,
        date: this.mealService.selectedDate,
        quantity: this.quantity,
      } as DayMeal;
      this.mealService.addMealOnDate(m);
      this.snack.open('Måltid tilføjet', 'OK');
    } catch (err) {
      this.snack.open('Hovsa, der gik noget gal´', 'ØV');
    } finally {
      this.loading = false;
    }
  }

  get remainingPhenyl(): number {
    return this.userPkuLimit - this.totalPhenylInMeals;
  }

  get totalPhenylInMeals(): number {
    let tot = 0;
    for (const m of this.dailyMeals) {
      tot += m.quantity * (m.meal.totalPhenyl / 100);
    }
    return tot;
  }
}
