import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Meal } from '../models/meal.interface';
import { UserService } from '../services/user/user.service';
import { Subscription } from 'rxjs';
import { SimpleUser } from '../models/simple-user.interface';
import { MealService } from '../services/meal/meal.service';
import { NgForm } from '@angular/forms';
import { DayMeal } from '../models/day-meal.interface';
import { Unit } from '../models/unit.enum';
import { SnackService } from '../services/snack.service';

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
  editing: number;
  mSub: Subscription;
  units = [Unit.STK, Unit.G, Unit.ML];

  mealsVisible: boolean;

  constructor(private user: UserService, public mealService: MealService, private snack: SnackService) { }

  ngOnInit() {
    this.subs = [
      this.user.getUser().subscribe((u: SimpleUser) => this.userPkuLimit = u.pkuLimit),
      this.mealService.getMeals().subscribe((m: Meal[]) => this.mealOptions = m),
      this.mealService.selectedDateMeal$.subscribe((m: DayMeal[]) => this.dailyMeals = m),
    ];

    setTimeout(() => {
      this.mealsVisible = true;
    }, 100);
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
        quantity: this.roundedQuantity,
        consumedOnTime: new Date().toTimeString().split(' ')[0]
      } as DayMeal;
      await this.mealService.addMealOnDate(m);
      this.snack.showInfo('Måltid tilføjet', 'OK');
    } catch (err) {
      this.snack.showError(`Hovsa, noget gik galt der: ${err}`, 'ØV');
    } finally {
      this.loading = false;
    }
  }

  async removeMealOnDate(meal: DayMeal) {
    try {
      this.loading = true;
      await this.mealService.removeMealOnDate(meal);
      this.snack.showInfo('Måltid fjernet', 'OK');
    } catch (err) {
      this.snack.showError(`Hovsa, noget gik galt der: ${err}`, 'ØV');
    } finally {
      this.loading = false;
    }
  }

  async deleteMeal(meal: Meal) {
    try {
      this.loading = true;
      await this.mealService.deleteMeal(meal);
      this.snack.showInfo('Måltid slettet', 'OK');
    } catch (err) {
      this.snack.showError(`Hovsa, noget gik galt der: ${err}`, 'ØV');
    } finally {
      this.loading = false;
    }
  }

  async updateMeal(dm: DayMeal): Promise<void> {
    try {
      this.loading = true;
      await this.mealService.updateDayMeal(dm);
      this.snack.showInfo('Måltidet blev opdateret');
    } catch (err) {
      this.snack.showError('Den gik ikke du...');
    } finally {
      this.editing = null;
      this.loading = false;
    }
  }

  showInfo(i: string) {
    this.snack.showInfo(i);
  }

  getPhenylInDayMeal(dm: DayMeal): number {
    return dm.unit === Unit.STK ? dm.meal.totalPhenyl * dm.quantity : dm.meal.phenylPer100 * (dm.quantity / 100);
  }

  getProteinInDayMeal(dm: DayMeal): number {
    return dm.unit === Unit.STK ? dm.meal.totalProtein * dm.quantity : dm.meal.proteinPer100 * (dm.quantity / 100);
  }

  get phenylInMeal(): number {
    return this.unit === Unit.STK ?
      this.selectedMeal.totalPhenyl * this.roundedQuantity :
      this.selectedMeal.phenylPer100 * (this.roundedQuantity / 100);
  }

  get proteinInMeal(): number {
    return this.unit === Unit.STK ?
      this.selectedMeal.totalProtein * this.roundedQuantity :
      this.selectedMeal.proteinPer100 * (this.roundedQuantity / 100);
  }

  get remainingPhenyl(): number {
    return Math.round(this.userPkuLimit - this.totalPhenylInMeals);
  }

  get totalPhenylInMeals(): number {
    let tot = 0;
    for (const m of this.dailyMeals) {
      tot += m.totalPhenyl;
    }
    return tot;
  }

  get roundedQuantity(): number {
    return Number(String(this.quantity).replace(',', '.'));
  }

  // get dayVisible(): boolean {
  //   return document.getElementById('snap-container').scrollTop < 10;
  // }
}
