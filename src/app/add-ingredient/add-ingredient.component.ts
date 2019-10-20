import { Component, ViewChild, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IngredientService } from '../services/ingredient/ingredient.service';
import { Ingredient } from '../models/ingredient.interface';
import { SnackService } from '../services/snack.service';
import { Unit } from '../models/unit.enum';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-ingredient',
  templateUrl: './add-ingredient.component.html',
  styleUrls: ['./add-ingredient.component.scss']
})
export class AddIngredientComponent implements OnChanges {
  @ViewChild('ingredientForm', { static: true }) form: NgForm;
  @Output() ingredientCreated = new EventEmitter<Ingredient>();
  @Output() inputClicked = new EventEmitter<void>();
  @Input() initialValue: string | Ingredient;
  name: string;
  protein: number;
  unit: Unit = Unit.G;
  loading: boolean;
  isGlobalIngredient: boolean;

  units = [Unit.G, Unit.ML];
  constructor(private ingredient: IngredientService, private snack: SnackService, private location: Location) {
    this.isGlobalIngredient = this.location.path().includes('global-meal');
  }

  ngOnChanges(c: SimpleChanges) {
    if (c.initialValue && c.initialValue.currentValue) {
      this.name = typeof this.initialValue === 'string' ? this.initialValue : this.initialValue.name;
    }
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
      await this.ingredient.createIngredient(toAdd, this.isGlobalIngredient);
      this.snack.showInfo('Madvare oprettet! :D', 'OK');
      this.form.resetForm();
      this.ingredientCreated.emit(toAdd);
    } catch (err) {
      this.snack.showError(`Hovsa, noget gik galt der: ${err}`, 'ØV!');
    } finally {
      this.loading = false;
    }

  }

  get roundedProtein(): number {
    return Number(String(this.protein).replace(',', '.'));
  }
}
