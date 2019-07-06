import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDatepicker } from '@angular/material';
import { MealService } from '../services/meal/meal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit, OnDestroy {
  private sub: Subscription;
  @ViewChild('picker', { static: true }) picker: MatDatepicker<Date>;
  selectedDate: Date;

  constructor(private mealService: MealService) { }

  ngOnInit() {
    this.selectedDate = this.mealService.selectedDate;
  }

  ngAfterViewInit(): void {
    this.picker.touchUi = true;
    this.sub = this.picker._selectedChanged.subscribe(d => this.setSelectedDate(d));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  setSelectedDate(d: Date) {
    this.mealService.selectedDate = d;
  }
}
