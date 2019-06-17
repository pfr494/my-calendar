import { Ingredient } from './ingredient.interface';

export interface MealIngredient extends Ingredient {
  quantity: number;
}
