import { Meal } from './meal.interface';

export interface DayMeal {
  uid: string;
  meal: Meal;
  date: Date;
  quantity: number;
}
