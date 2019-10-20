import { Meal } from '../models/meal.interface';
import * as lo from 'lodash';
import { MealIngredient } from '../models/meal-ingredient.interface';

export function getPhenylPer100g(totalPhenyl: number, meal: Meal): number {
  return totalPhenyl / (this.totalQuantityInMealIngredients(meal) / 100);
}

export function getProteinPer100g(totalProtein: number, meal: Meal): number {
  return totalProtein / (this.totalQuantityInMealIngredients(meal) / 100);
}

export function totalPhenylInMealIngredients(ingredients: MealIngredient[]): number {
  return lo.sum(ingredients.map(i =>  i.ingredient.phenyl * (i.quantity / 100)));
}

export function totalProteinInMealIngredients(ingredients: MealIngredient[]): number {
  return lo.sum(ingredients.map(i => i.ingredient.protein * (i.quantity / 100)));
}

export function totalQuantityInMealIngredients(meal: Meal): number {
  return lo.sum(meal.ingredients.map(ing => ing.quantity));
}
