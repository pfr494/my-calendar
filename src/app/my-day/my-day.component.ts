import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Meal } from '../models/meal.interface';
import { UserService } from '../services/user/user.service';
import { Subscription } from 'rxjs';
import { SimpleUser } from '../models/simple-user.interface';
import { MealService } from '../services/meal/meal.service';
import { NgForm } from '@angular/forms';
import { DayMeal } from '../models/day-meal.interface';
import { MatSnackBar } from '@angular/material';
import { Unit } from '../models/unit.enum';

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
  unit = Unit.STK;
  selectedMeal: Meal;

  loading: boolean;
  mSub: Subscription;
  units = [Unit.STK, Unit.G, Unit.ML];

  mealsVisible: boolean;

  constructor(private user: UserService, public mealService: MealService, private snack: MatSnackBar) { }

  ngOnInit() {
    this.subs = [
      this.user.getUser().subscribe((u: SimpleUser) => this.userPkuLimit = u.pkuLimit),
      this.mealService.getMeals().subscribe((m: Meal[]) => this.mealOptions = m),
      this.mealService.selectedDateMeal$.subscribe((m: DayMeal[]) => this.dailyMeals = m),
    ];

    setTimeout(() => {
      this.mealsVisible = true;
    }, 800);
  }

  ngOnDestroy() {
    for (const s of this.subs) {
      s.unsubscribe();
    }
  }

  async addMealOnDate() {
    try {
      this.loading = true;
      const m = {
        meal: this.selectedMeal,
        date: this.mealService.selectedDate,
        totalPhenyl: this.phenylInMeal,
        totalProtein: this.proteinInMeal,
        unit: this.unit,
        quantity: this.quantity,
      } as DayMeal;
      await this.mealService.addMealOnDate(m);
      this.snack.open('Måltid tilføjet', 'OK', { duration: 3000 });
    } catch (err) {
      this.snack.open('Hovsa, der gik noget gal´', 'ØV', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  async removeMealOnDate(meal: DayMeal) {
    try {
      this.loading = true;
      await this.mealService.removeMealOnDate(meal);
      this.snack.open('Måltid fjernet', 'OK', { duration: 3000 });
    } catch (err) {
      this.snack.open('Hovsa, der gik noget gal´', 'ØV', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  async deleteMeal(meal: Meal) {
    try {
      this.loading = true;
      await this.mealService.deleteMeal(meal);
      this.snack.open('Måltid slettet', 'OK', { duration: 3000 });
    } catch (err) {
      this.snack.open('Hovsa, der gik noget gal´', 'ØV', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  getPhenylInDayMeal(dm: DayMeal): number {
    return dm.unit === Unit.STK ? dm.meal.totalPhenyl * dm.quantity : dm.meal.phenylPer100 * (dm.quantity / 100);
  }

  getProteinInDayMeal(dm: DayMeal): number {
    return dm.unit === Unit.STK ? dm.meal.totalProtein * dm.quantity : dm.meal.proteinPer100 * (dm.quantity / 100);
  }

  get phenylInMeal(): number {
    return this.unit === Unit.STK ?
      this.selectedMeal.totalPhenyl * this.quantity :
      this.selectedMeal.phenylPer100 * (this.quantity / 100);
  }

  get proteinInMeal(): number {
    return this.unit === Unit.STK ?
      this.selectedMeal.totalProtein * this.quantity :
      this.selectedMeal.proteinPer100 * (this.quantity / 100);
  }

  get remainingPhenyl(): number {
    return this.userPkuLimit - this.totalPhenylInMeals;
  }

  get totalPhenylInMeals(): number {
    let tot = 0;
    for (const m of this.dailyMeals) {
      tot += m.totalPhenyl;
    }
    return tot;
  }

  // get dayVisible(): boolean {
  //   return document.getElementById('snap-container').scrollTop < 10;
  // }
}
