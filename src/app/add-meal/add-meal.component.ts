import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Meal } from '../models/meal.interface';
import { MealService } from '../services/meal/meal.service';

@Component({
  selector: 'app-add-meal',
  templateUrl: './add-meal.component.html',
  styleUrls: ['./add-meal.component.scss']
})
export class AddMealComponent implements OnInit, OnDestroy {
  foodControl = new FormControl();
  options: Meal[];
  filteredOptions: Observable<Meal[]>;

  constructor(private meals: MealService) { }

  ngOnInit() {
    this.meals.getMeals().subscribe(ms => this.options = ms);
    this.filteredOptions = this.foodControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  ngOnDestroy(): void {
    // Unsubscribe
  }

  private _filter(value: string): Meal[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option: Meal) => option.name.toLowerCase().includes(filterValue));
  }
}
