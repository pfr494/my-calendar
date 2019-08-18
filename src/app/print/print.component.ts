import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';


import { MealService } from '../services/meal/meal.service';
import { DayMeal } from '../models/day-meal.interface';
import { MatDatepicker } from '@angular/material';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { isNullOrUndefined } from 'util';

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
  }

  ngAfterViewInit() {
    this.pickerFrom.touchUi = true;
    this.pickerTo.touchUi = true;
    this.toDate = this.mealService.selectedDate;
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
  }

  setMealsInPeriod() {
    this.mealsInPeriod = this.fromDate && this.toDate ?
      this.dayMeals.filter(dm => moment(dm.date).isAfter(moment(this.fromDate).subtract(1, 'days')) &&
        moment(dm.date).isBefore(moment(this.toDate).add(1, 'days'))) : [];
    console.log(this.mealsInPeriod);
  }

  get mealsAsStringArrays(): string[][] {
    const strings = [];
    this.mealsInPeriod.forEach(me => {
      // const toAdd = Object.values(me).map((v: string | number) => v.toString());
      const toAdd = [
        me.meal.name,
        this.datePipe.transform(this.mealService.selectedDate, 'dd-MM-yyyy'),
        me.consumedOnTime,
        me.quantity.toString(),
        me.totalProtein.toString(),
        me.totalPhenyl.toString()
      ];
      strings.push(toAdd);
    });
    return strings;
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
      ]
    });
    return doc;
  }
}
