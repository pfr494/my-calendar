import { IngredientService } from '../services/ingredient/ingredient.service';
import { Ingredient } from '../models/ingredient.interface';
import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Unit } from '../models/unit.enum';

@Component({
  selector: 'app-add-ingredient',
  templateUrl: './add-ingredient.component.html',
  styleUrls: ['./add-ingredient.component.scss']
})
export class AddIngredientComponent implements OnInit {
  @ViewChild('ingredientForm', { static: true }) form: NgForm;
  @Output() ingredientCreated = new EventEmitter<Ingredient>();
  @Output() inputClicked = new EventEmitter<void>();
  @Input() name: string;
  protein: number;
  unit: Unit = Unit.G;
  loading: boolean;

  units = [Unit.G, Unit.ML];
  constructor(private ingredient: IngredientService, private snack: MatSnackBar) { }

  ngOnInit() {
  }

  get phenyl(): number {
    // 1g protein = 50mg phenyl
    return this.roundedProtein * 50;
  }

  async createIngredient() {
    try {
      this.loading = true;
      const toAdd = {
        name: this.name,
        protein: this.roundedProtein,
        phenyl: this.phenyl,
        unit: this.unit
      } as Ingredient;
      await this.ingredient.createIngredient(toAdd);
      this.snack.open('Madvare oprettet! :D', 'OK', { duration: 3000 });
      this.form.resetForm();
      this.ingredientCreated.emit(toAdd);
    } catch (err) {
      this.snack.open(`Hovsa, noget gik galt der: ${err}`, 'ØV!', { duration: 3000 });
    } finally {
      this.loading = false;
    }

  }

  get roundedProtein(): number {
    return Number(String(this.protein).replace(',', '.'));
  }
}
