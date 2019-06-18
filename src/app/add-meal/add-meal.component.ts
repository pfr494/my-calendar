import { MealIngredient } from '../models/meal-ingredient.interface';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MealService } from '../services/meal/meal.service';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Meal } from '../models/meal.interface';
import { FormControl } from '@angular/forms';
import { Ingredient } from '../models/ingredient.interface';
import { IngredientService } from '../services/ingredient/ingredient.service';

@Component({
  selector: 'app-add-meal',
  templateUrl: './add-meal.component.html',
  styleUrls: ['./add-meal.component.scss']
})
export class AddMealComponent implements OnInit, OnDestroy {
  private subs: Subscription[];
  ingredientOptions: Ingredient[] = [];

  quantity: number;
  ingredient: Ingredient;

  loading: boolean;

  meal = {
    name: '',
    ingredients: [],
  } as Meal;

  constructor(private mealService: MealService, private ingredientService: IngredientService) { }

  ngOnInit() {
    this.subs = [
      this.ingredientService.getIngredients().subscribe(i => this.ingredientOptions = i)
    ];
  }

  ngOnDestroy(): void {
    for (const s of this.subs) {
      s.unsubscribe();
    }
  }

  addIngredient() {
    const i = Object.assign({}, this.ingredient);
    const mi = {
      ...i,
      quantity: this.quantity
    } as MealIngredient;
    this.meal.ingredients = [...this.meal.ingredients, mi];

    this.ingredient = null;
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
    } finally {
      this.loading = false;
    }
  }

  get ingredients(): MealIngredient[] {
    return this.meal.ingredients;
  }

  get totalPhenyl(): number {
    let t = 0;
    for (const i of this.meal.ingredients) {
      t += (i.phenyl * (i.quantity / 100));
    }
    return t;
  }

  get totalProtein(): number {
    let t = 0;
    for (const i of this.meal.ingredients) {
      t += (i.protein * (i.quantity / 100));
    }
    return t;
  }
}
