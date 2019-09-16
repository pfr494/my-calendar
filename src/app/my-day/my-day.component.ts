import { MealIngredient } from '../models/meal-ingredient.interface';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { SimpleUser } from '../models/simple-user.interface';
import { MealService } from '../services/meal/meal.service';
import { SnackService } from '../services/snack.service';
import { DayMeal } from '../models/day-meal.interface';
import { Subscription, Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Meal } from '../models/meal.interface';
import { FormControl, NgForm } from '@angular/forms';
import { Unit } from '../models/unit.enum';
import * as lo from 'lodash';

@Component({
  selector: 'app-my-day',
  templateUrl: './my-day.component.html',
  styleUrls: ['./my-day.component.scss']
})
export class MyDayComponent implements OnInit, OnDestroy {
  @ViewChild('form', {static: false}) form: NgForm;
  mealControl = new FormControl();
  private subs: Subscription[];
  userPkuLimit: number;
  dailyMeals: DayMeal[] = [];
  mealOptions: Meal[] = [];
  filteredMealOptions: Observable<Meal[]>;
  quantity: number;
  unit = Unit.STK;
  selectedMeal: Meal;

  loading: boolean;
  editing: number;

  get filteredUnits(): Unit[] {
    return this.selectedMeal && this.selectedMeal.unit === Unit.G ? [Unit.STK, Unit.G] : [Unit.STK, Unit.ML];
  }

  mealsVisible: boolean;

  constructor(private user: UserService, public mealService: MealService, private snack: SnackService) { }

  ngOnInit() {
    this.subs = [
      this.user.getUser().subscribe((u: SimpleUser) => this.userPkuLimit = u.pkuLimit),
      this.mealService.getMeals().subscribe((m: Meal[]) => this.mealOptions = m),
      this.mealService.selectedDateMeal$.subscribe((m: DayMeal[]) => this.dailyMeals = m),
      this.mealControl.valueChanges.subscribe((v) => {
        this.selectedMeal = v && typeof v === 'object' ? v : null;
      })
    ];
    this.filteredMealOptions = this.mealControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    setTimeout(() => {
      this.mealsVisible = true;
    }, 250);
  }

  ngOnDestroy() {
    for (const s of this.subs) {
      s.unsubscribe();
    }
  }

  ingredientQuantityInMeal(ingredient: MealIngredient, dm: DayMeal): number {
    if (dm.unit === Unit.STK) {
      return Number(dm.quantity) * ingredient.quantity;
    } else {
      const timesConsumed = Number(dm.quantity) / this.totalQuantityInMealIngredients(dm.meal);
      return ingredient.quantity * timesConsumed;
    }
  }

  totalQuantityInMeal(dm: DayMeal): number {
    if (dm.unit === Unit.STK) {
      return lo.sum(dm.meal.ingredients.map(ing => ing.quantity)) * dm.quantity;
    } else {
      return Number(dm.quantity);
    }
  }

  totalQuantityInMealIngredients(meal: Meal): number {
    return lo.sum(meal.ingredients.map(ing => ing.quantity));
  }

  async addMealOnDate() {
    try {
      this.loading = true;
      const m = {
        meal: this.selectedMeal,
        date: this.mealService.selectedDate,
        totalPhenyl: this.getPhenylInMeal(this.selectedMeal, this.getRundedQuantity(this.quantity)),
        totalProtein: this.getProteinInMeal(this.selectedMeal, this.getRundedQuantity(this.quantity)),
        unit: this.unit,
        quantity: this.getRundedQuantity(this.quantity),
        consumedOnTime: new Date().toTimeString().split(' ')[0],
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
      this.mealControl.setValue('');
      this.form.form.markAsPristine();
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
      const m = {
        meal: dm.meal,
        date: dm.date,
        totalPhenyl: this.getPhenylInMeal(dm.meal, this.getRundedQuantity(dm.quantity)),
        totalProtein: this.getProteinInMeal(dm.meal, this.getRundedQuantity(dm.quantity)),
        unit: dm.unit,
        quantity: this.getRundedQuantity(dm.quantity),
        consumedOnTime: dm.consumedOnTime,
        uid: dm.uid
      } as DayMeal;
      await this.mealService.updateDayMeal(m);
      this.snack.showInfo('Måltidet blev opdateret');
    } catch (err) {
      this.snack.showError('Den gik ikke du...');
    } finally {
      this.editing = null;
      this.loading = false;
    }
  }

  private _filter(value: string | Meal): Meal[] {
    if (!value) {
      return this.mealOptions;
    } else {
      const filterValue = typeof value === 'string' ? value.toLowerCase() : value.name;
      return this.mealOptions.filter((meal: Meal) => meal.name.toLowerCase().indexOf(filterValue) === 0);
    }
  }

  displayFn(m?: Meal): string | undefined {
    return m ? m.name : '';
  }

  showInfo(i: string) {
    this.snack.showInfo(i);
  }

  togglePanelIfEmpty() {
    if (!this.mealControl.value) { this.mealControl.setValue(''); }
  }

  getPhenylInDayMeal(dm: DayMeal): number {
    return dm.unit === Unit.STK ? dm.meal.totalPhenyl * dm.quantity : dm.meal.phenylPer100 * (dm.quantity / 100);
  }

  getProteinInDayMeal(dm: DayMeal): number {
    return dm.unit === Unit.STK ? dm.meal.totalProtein * dm.quantity : dm.meal.proteinPer100 * (dm.quantity / 100);
  }

  getPhenylInMeal(meal: Meal, quantity: number): number {
    return this.unit === Unit.STK ?
      meal.totalPhenyl * quantity :
      meal.phenylPer100 * (this.totalQuantityInMealIngredients(meal) / 100);
  }

  getProteinInMeal(meal: Meal, quantity: number): number {
    return this.unit === Unit.STK ?
      meal.totalProtein * quantity :
      meal.proteinPer100 * (this.totalQuantityInMealIngredients(meal) / 100);
  }

  get remainingPhenyl(): number {
    return this.totalPhenylInMeals ? +Math.round(this.userPkuLimit - this.totalPhenylInMeals) : this.userPkuLimit;
  }

  get totalPhenylInMeals(): number {
    return lo.sum(this.dailyMeals.map(m => m.totalPhenyl));
  }

  getRundedQuantity(q: number | string): number {
    return Number(String(q).replace(',', '.'));
  }

  // get dayVisible(): boolean {
  //   return document.getElementById('snap-container').scrollTop < 10;
  // }
}
