import { IngredientService } from '../services/ingredient/ingredient.service';
import { Ingredient } from '../models/ingredient.interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-add-ingredient',
  templateUrl: './add-ingredient.component.html',
  styleUrls: ['./add-ingredient.component.scss']
})
export class AddIngredientComponent implements OnInit {
  @ViewChild('ingredientForm', { static: true }) form: NgForm;
  name: string;
  protein: number;
  loading: boolean;
  // 1g protein = 50mg phenyl
  constructor(private ingredient: IngredientService, private snack: MatSnackBar) { }

  ngOnInit() {
  }

  get phenyl(): number {
    return this.protein * 50;
  }

  async createIngredient() {
    try {
      this.loading = true;
      const toAdd = {
        name: this.name,
        protein: this.protein,
        phenyl: this.phenyl
      } as Ingredient;
      await this.ingredient.createIngredient(toAdd);
      this.snack.open('Madvare oprettet! :D', 'OK');
      this.form.resetForm();
    } catch (err) {
      this.snack.open(`Hovsa, noget gik galt der: ${err}`, 'ØV');
    } finally {
      this.loading = false;
    }

  }
}
