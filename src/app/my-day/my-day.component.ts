import { Component, OnInit } from '@angular/core';
import { Meal } from '../models/meal.interface';

@Component({
  selector: 'app-my-day',
  templateUrl: './my-day.component.html',
  styleUrls: ['./my-day.component.scss']
})
export class MyDayComponent implements OnInit {
  meals: Meal[];

  constructor() { }

  ngOnInit() {
  }

}
