import { MealIngredient } from './meal-ingredient.interface';
import { Unit } from './unit.enum';

// 1 liste er 25 mg phenyl
export interface Meal {
  name: string;
  ingredients: MealIngredient[];
  totalProtein: number;
  totalPhenyl: number;
  proteinPer100: number;
  phenylPer100: number;
  unit: Unit;
}
