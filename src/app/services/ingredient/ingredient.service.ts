import { Ingredient } from 'src/app/models/ingredient.interface';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {

  constructor(private db: AngularFireDatabase, private authService: AuthService) { }

  getIngredients(): Observable<Ingredient[]> {
    return this.db.list(`users/${this.authService.currentUser.uid}/ingredients`).valueChanges() as Observable<Ingredient[]>;
  }

  getGlobalIngredients(): Observable<Ingredient[]> {
    return this.db.list(`ingredients`).valueChanges() as Observable<Ingredient[]>;
  }

  async createIngredient(ingredient: Ingredient, global?: boolean): Promise<any> {
    const i = {
      ...ingredient,
      uid: this.db.createPushId()
    };
    const path = global ? `ingredients/${i.uid}` : `users/${this.authService.currentUser.uid}/ingredients/${i.uid}`;
    return this.db.object(path).set(i);
  }

  async deleteIngredient(ingredient: Ingredient): Promise<any> {
    return this.db.object(`users/${this.authService.currentUser.uid}/ingredients/${ingredient.uid}`).remove();
  }
}
