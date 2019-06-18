import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Meal } from 'src/app/models/meal.interface';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MealService {

  constructor(private db: AngularFireDatabase, private auth: AuthService) { }

  getMeals(): Observable<Meal[]> {
    return this.db.list(`meals`).valueChanges() as Observable<Meal[]>;
  }

  getMyMealsOnDate(date: Date): Observable<Meal[]> {
    const user: any = this.auth.currentUser;
    return this.db.list(`users/${user.$key}/meals`).valueChanges() as Observable<Meal[]>;
  }

  async addMeal(meal: Meal): Promise<any> {
    const user: any = this.auth.currentUser;
    return this.db.list(`meals`).push(meal);
  }

  async addMealOnDate(meal: Meal, date: Date): Promise<any> {
    const user: any = this.auth.currentUser;
    return this.db.list(`users/${user.$key}/meals/${date}/${meal.name}`).push(meal);
  }
}
