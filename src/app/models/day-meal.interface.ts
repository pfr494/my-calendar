import { Meal } from './meal.interface';
import { Unit } from './unit.enum';

export interface DayMeal {
  uid: string;
  meal: Meal;
  date: Date;
  totalPhenyl: number;
  totalProtein: number;
  quantity: number;
  unit: Unit;
  consumedOn: Date;
}
