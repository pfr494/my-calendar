import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCalendar } from '@angular/material';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @ViewChild('overview', { static: true }) calendar: MatCalendar<Date>;
  selectedDate: Date;

  constructor() { }

  ngOnInit() {
    this.selectedDate = new Date();
  }

}
