import { IngredientService } from '../services/ingredient/ingredient.service';
import { Ingredient } from '../models/ingredient.interface';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-ingredient',
  templateUrl: './add-ingredient.component.html',
  styleUrls: ['./add-ingredient.component.scss']
})
export class AddIngredientComponent implements OnInit {
  nameControl = new FormControl();
  proteinControl = new FormControl();
  loading: boolean;
  // 1g protein = 50mg phenyl
  constructor(private ingredient: IngredientService) { }

  ngOnInit() {
  }

  get phenyl(): number {
    return this.proteinControl.value * 50;
  }

  async createIngredient() {
    try {
      this.loading = true;
      const toAdd = {
        name: this.nameControl.value,
        protein: this.proteinControl.value,
        phenyl: this.phenyl
      } as Ingredient;
      await this.ingredient.createIngredient(toAdd);
    } finally {
      this.loading = false;
    }

  }
}
