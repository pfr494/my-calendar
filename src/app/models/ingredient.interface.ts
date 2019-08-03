import { Unit } from './unit.enum';

export interface Ingredient {
  name: string;
  protein: number;
  phenyl: number;
  unit: Unit;
  uid: string;
}
