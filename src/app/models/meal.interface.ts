import { MealIngredient } from './meal-ingredient.interface';

// 1 liste er 25 mg phenyl
export interface Meal {
  name: string;
  ingredients: MealIngredient[];
  totalProtein: number;
  totalPhenyl: number;
}
