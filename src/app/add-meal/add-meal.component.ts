import { MealIngredient } from '../models/meal-ingredient.interface';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MealService } from '../services/meal/meal.service';
import { Subscription, Observable } from 'rxjs';
import { Meal } from '../models/meal.interface';
import { Ingredient } from '../models/ingredient.interface';
import { IngredientService } from '../services/ingredient/ingredient.service';
import { MatSnackBar } from '@angular/material';
import { NgForm, FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { stringify } from 'querystring';

@Component({
  selector: 'app-add-meal',
  templateUrl: './add-meal.component.html',
  styleUrls: ['./add-meal.component.scss']
})
export class AddMealComponent implements OnInit, OnDestroy {
  @ViewChild('mealForm', { static: true }) form: NgForm;
  ingredientControl = new FormControl();
  private subs: Subscription[];
  ingredientOptions: Ingredient[] = [];
  filteredIngredientOptions: Observable<Ingredient[]>;


  quantity: number;
  ingredient: Ingredient;

  loading: boolean;
  createIngredient = false;
  meal = {
    name: '',
    ingredients: [],
  } as Meal;

  constructor(private mealService: MealService, private ingredientService: IngredientService, private snack: MatSnackBar) { }

  ngOnInit() {
    this.subs = [
      this.ingredientService.getIngredients().subscribe(i => this.ingredientOptions = i)
    ];
    this.filteredIngredientOptions = this.ingredientControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): Ingredient[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.ingredientOptions.filter((ingredient: Ingredient) => ingredient.name.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnDestroy(): void {
    for (const s of this.subs) {
      s.unsubscribe();
    }
  }

  addIngredient(ingredient?: Ingredient) {
    const i = Object.assign({}, {
      ingredient: ingredient ? ingredient : this.selectedIngredient,
      quantity: this.quantity
    } as MealIngredient);
    this.meal.ingredients = [...this.meal.ingredients, i];
    this.ingredientControl.reset();
    this.quantity = null;
  }

  removeIngredient(index: number) {
    this.meal.ingredients.splice(index, 1);
  }

  async saveMeal() {
    try {
      this.loading = true;
      const m = {
        ...this.meal,
        totalPhenyl: this.totalPhenyl,
        totalProtein: this.totalProtein
      } as Meal;
      await this.mealService.addMeal(m);
      this.meal.ingredients = [];
      this.form.resetForm();
      this.snack.open('Måltid oprettet, yay! :p', 'OK');
    } catch (err) {
      this.snack.open(`Hovsa, noget gik galt der: ${err}`, 'ØV');
    } finally {
      this.loading = false;
    }
  }

  ingredientCreated(ingredient: Ingredient) {
    if (!!this.quantity) {
      this.addIngredient(ingredient);
    }
  }

  displayFn(i?: Ingredient): string | undefined {
    return i ? i.name : undefined;
  }

  get selectedIngredient(): Ingredient | null {
    return this.ingredientControl.value;
  }

  get totalPhenyl(): number {
    let t = 0;
    for (const i of this.meal.ingredients) {
      t += (i.ingredient.phenyl * (i.quantity / 100));
    }
    return Math.round(t);
  }

  get totalProtein(): number {
    let t = 0;
    for (const i of this.meal.ingredients) {
      t += (i.ingredient.protein * (i.quantity / 100));
    }
    return Math.round(t);
  }

  get canAdd(): boolean {
    return this.selectedIngredient && typeof this.selectedIngredient !== 'string' && !!this.quantity;
  }
}
