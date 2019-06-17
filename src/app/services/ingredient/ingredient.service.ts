import { Ingredient } from 'src/app/models/ingredient.interface';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {

  constructor(private db: AngularFireDatabase) { }

  getIngredients(): Observable<Ingredient[]> {
    return this.db.list('ingredients').valueChanges() as Observable<Ingredient[]>;
  }

  async createIngredient(i: Ingredient): Promise<any> {
    return this.db.list('ingredients/').push(i);
  }
}
