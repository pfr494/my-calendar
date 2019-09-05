import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';


import { MealService } from '../services/meal/meal.service';
import { DayMeal } from '../models/day-meal.interface';
import { MatDatepicker } from '@angular/material';
import { DatePipe } from '@angular/common';
import { isNullOrUndefined } from 'util';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import * as jsPDF from 'jspdf';
import * as lo from 'lodash';
import 'jspdf-autotable';
import { Unit } from '../models/unit.enum';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss'],
  providers: [DatePipe]
})
export class PrintComponent implements OnDestroy, AfterViewInit {
  @ViewChild('pickerFrom', { static: true }) pickerFrom: MatDatepicker<Date>;
  @ViewChild('pickerTo', { static: true }) pickerTo: MatDatepicker<Date>;
  subs: Subscription[] = [];
  mealsInPeriod: DayMeal[];
  dayMeals: DayMeal[];

  fromDate: Date;
  toDate: Date;

  constructor(public mealService: MealService, private datePipe: DatePipe) {
    this.subs = [this.mealService.getAllDayMeals().subscribe(m => this.setMeals(m))];
    this.toDate = new Date();
    this.fromDate = moment(this.toDate).subtract(7, 'days').toDate();
  }

  ngAfterViewInit() {
    this.pickerFrom.touchUi = true;
    this.pickerTo.touchUi = true;
    this.subs.push(this.pickerFrom._selectedChanged.subscribe((d) => {
      this.fromDate = d;
      this.setMealsInPeriod();
    }));
    this.subs.push(this.pickerTo._selectedChanged.subscribe((d) => {
      this.toDate = d;
      this.setMealsInPeriod();
    }));
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  setMeals(dms: object[]) {
    let flatMeals: DayMeal[] = [];
    dms.forEach(d => {
      flatMeals = [...flatMeals, ...Object.values(d)];
    });
    this.dayMeals = flatMeals.filter(d => !isNullOrUndefined(d.date));
    this.setMealsInPeriod();
  }

  setMealsInPeriod() {
    const from = moment(this.fromDate).subtract(1, 'days');
    const to = moment(this.toDate).add(1, 'days');
    this.mealsInPeriod = this.fromDate && this.toDate ?
    this.dayMeals.filter(dm => this.stringToDate(String(dm.date)).isAfter(from) && this.stringToDate(String(dm.date)).isBefore(to)) : [];
    console.log(this.mealsInPeriod);
  }

  stringToDate(dateString: string /*dd-MM-yyyy*/): moment.Moment {
    const parts = dateString.split('-');
    return moment(`${parts[2]}-${parts[1]}-${parts[0]}`);
  }

  get mealsAsStringArrays(): string[][] {
    const strings = [];
    this.mealsInPeriod.forEach(me => {
      // const toAdd = Object.values(me).map((v: string | number) => v.toString());
      const toAdd = [
        me.meal.name,
        me.date,
        me.consumedOnTime,
        this.getQuantityAndUnitInMeal(me),
        me.totalProtein.toString() + 'g',
        me.totalPhenyl.toString() + 'mg'
      ];
      strings.push(toAdd);
    });
    return strings;
  }

  getQuantityAndUnitInMeal(me: DayMeal): string {
    if (me.unit === Unit.STK) {
      const totalQuantiy = lo.sum(me.meal.ingredients.map(i => i.quantity));
      return `${me.quantity * totalQuantiy} ${me.meal.unit}`;
    } else {
      return `${me.quantity} ${me.meal.unit}`;
    }
  }

  captureScreen() {
    const doc = this.generatePdfDoc();
    doc.save(`pku-udskrift${this.datePipe.transform(this.mealService.selectedDate, 'dd-MM-yyyy')}.pdf`);
  }

  share() {
    const nav: any = navigator;
    const doc = this.generatePdfDoc() as jsPDF;
    const url = doc.output('datauristring');
    if (nav.share) {
      nav.share({
        title: 'PKU Udskrift',
        text: `pku-udskrift${this.datePipe.transform(this.mealService.selectedDate, 'dd-MM-yyyy')}.pdf`,
        url,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }
  }

  generatePdfDoc() {
    const doc: any = new jsPDF();
    doc.autoTable({
      head: [['Måltid', 'Dato', 'Tidspunkt', 'Mængde', 'Protein indhold', 'Phe indhold']],
      body: [
        ...this.mealsAsStringArrays
      ],
      theme: 'grid'
    });
    return doc;
  }

  getTime(ts: string): string {
    return ts ? `${ts.split(':')[0]}:${ts.split(':')[0]}` : '';
  }
}
