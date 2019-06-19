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

  async createIngredient(i: Ingredient): Promise<any> {
    return this.db.list(`users/${this.authService.currentUser.uid}/ingredients`).push(i);
  }
}
