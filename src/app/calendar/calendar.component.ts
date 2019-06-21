import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCalendar } from '@angular/material';
import { MealService } from '../services/meal/meal.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @ViewChild('overview', { static: true }) calendar: MatCalendar<Date>;
  selectedDate: Date;

  constructor(private mealService: MealService) { }

  ngOnInit() {
    this.selectedDate = new Date();
  }

  setSelectedDate(d: Date) {
    this.mealService.selectedDate = d;
  }
}
