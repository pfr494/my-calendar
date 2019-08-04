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
import { Unit } from '../models/unit.enum';
import { Location } from '@angular/common';

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
  units = [Unit.G, Unit.ML];

  loading: boolean;
  createIngredient = false;
  meal = {
    name: '',
    ingredients: [],
    unit: Unit.G
  } as Meal;

  constructor(
    private mealService: MealService,
    private ingredientService: IngredientService,
    private snack: MatSnackBar,
    private location: Location) { }

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
      quantity: this.roundedQuantity
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
        totalProtein: this.totalProtein,
        phenylPer100: this.phenylPer100,
        proteinPer100: this.proteinPer100
      } as Meal;
      await this.mealService.addMeal(m);
      this.meal.ingredients = [];
      this.form.resetForm();
      this.snack.open('Måltid oprettet, yay! :p', 'OK', { duration: 3000 });
      this.location.back();
    } catch (err) {
      this.snack.open(`Hovsa, noget gik galt der: ${err}`, 'ØV', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  async deleteIngredient(i: Ingredient) {
    try {
      this.loading = true;
      const ing: Ingredient = await this.ingredientService.deleteIngredient(i);
      this.ingredientControl.setValue(null);
      this.snack.open('Ingrediens blev slettet', 'OK', { duration: 3000 });
    } catch (err) {
      this.snack.open(`Hovsa, noget gik galt der: ${err}`, 'ØV', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  ingredientCreated(ingredient: Ingredient) {
    this.createIngredient = false;
    this.ingredientControl.setValue(ingredient);
  }

  displayFn(i?: Ingredient): string | undefined {
    return i ? i.name : undefined;
  }

  get selectedIngredient(): Ingredient | null {
    return this.ingredientControl.value;
  }

  get phenylPer100(): number {
    let phe = 0;
    let quan = 0;
    for (const p of this.meal.ingredients) {
      phe += p.ingredient.phenyl;
      quan += + p.quantity;
    }
    return (phe / quan) * 100;
  }

  get proteinPer100(): number {
    let pro = 0;
    let quan = 0;
    for (const p of this.meal.ingredients) {
      pro += p.ingredient.protein;
      quan += + p.quantity;
    }
    return (pro / quan) * 100;
  }

  get totalPhenyl(): number {
    let t = 0;
    for (const i of this.meal.ingredients) {
      t += (i.ingredient.phenyl * (i.quantity / 100));
    }
    return t;
  }

  get totalProtein(): number {
    let t = 0;
    for (const i of this.meal.ingredients) {
      t += (i.ingredient.protein * (i.quantity / 100));
    }
    return t;
  }

  get canAdd(): boolean {
    return this.selectedIngredient && typeof this.selectedIngredient !== 'string' && !!this.quantity;
  }

  get roundedQuantity(): number {
    return Number(String(this.quantity).replace(',', '.'));
  }
}
