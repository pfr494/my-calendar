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
  foodControl = new FormControl();
  quantityControl = new FormControl();
  options: Ingredient[] = [];
  filteredOptions: Observable<Ingredient[]>;

  meal = {
    ingredients: []
  } as Meal;

  constructor(private mealService: MealService, private ingredientService: IngredientService) { }

  ngOnInit() {
    this.subs = [
      this.ingredientService.getIngredients().subscribe(i => this.options = i)
    ];
    this.filteredOptions = this.foodControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  ngOnDestroy(): void {
    for (const s of this.subs) {
      s.unsubscribe();
    }
  }

  addIngredient() {
    const i = {
      
    } as MealIngredient;
    this.meal.ingredients = [...this.meal.ingredients, i];
  }

  get ingredients(): MealIngredient[] {
    return this.meal.ingredients;
  }

  private _filter(value: string): Ingredient[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option: Ingredient) => option.name.toLowerCase().includes(filterValue));
  }
}
