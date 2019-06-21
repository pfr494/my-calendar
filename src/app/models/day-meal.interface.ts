import { Meal } from './meal.interface';

export interface DayMeal {
  meal: Meal;
  date: Date;
  quantity: number;
}
