import { Ingredient } from './ingredient.interface';

export interface Meal {
  name: string;
  ingredients: Ingredient[];
  totalFat: number;
  totalProtein: number;
}
