import { Component, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';


import { MealService } from '../services/meal/meal.service';
import { DayMeal } from '../models/day-meal.interface';
import { MatDatepicker } from '@angular/material';
import { DatePipe, DecimalPipe } from '@angular/common';
import { isNullOrUndefined } from 'util';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import * as jsPDF from 'jspdf';
import { SimpleUser } from '../models/simple-user.interface';
import { UserService } from '../services/user/user.service';
import 'jspdf-autotable';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss'],
  providers: [DatePipe, DecimalPipe]
})
export class PrintComponent implements OnDestroy, AfterViewInit {
  @ViewChild('pickerFrom', { static: true }) pickerFrom: MatDatepicker<Date>;
  @ViewChild('pickerTo', { static: true }) pickerTo: MatDatepicker<Date>;
  subs: Subscription[] = [];
  mealsInPeriod: DayMeal[];
  user: SimpleUser;
  dayMeals: DayMeal[];

  fromDate: Date;
  toDate: Date;

  constructor(public mealService: MealService, private userService: UserService, private datePipe: DatePipe, private decimal: DecimalPipe) {
    this.toDate = new Date();
    this.fromDate = moment(this.toDate).subtract(7, 'days').toDate();
    const from = moment(this.fromDate).subtract(1, 'days').toDate();
    const to = moment(this.toDate).add(1, 'days').toDate();
    this.subs = [
      // this.mealService.getAllDayMeals().subscribe(m => this.setMeals(m)),
      // this.mealService.getAllDayMeals().subscribe(m => this.setMeals(m)),
      this.userService.currentUser$.subscribe(u => this.user = u),
      this.mealService.getDayMealsInPeriod(from, to).subscribe(m => this.setMeals(m))
    ];
  }

  ngAfterViewInit() {
    this.pickerFrom.touchUi = true;
    this.pickerTo.touchUi = true;
    this.subs.push(this.pickerFrom._selectedChanged.subscribe((d) => {
      this.fromDate = d;
      // this.setMealsInPeriod();
    }));
    this.subs.push(this.pickerTo._selectedChanged.subscribe((d) => {
      this.toDate = d;
      // this.setMealsInPeriod();
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
    this.mealsInPeriod = this.dayMeals;
    // this.setMealsInPeriod();
  }

  // setMealsInPeriod() {
  //   const from = moment(this.fromDate).subtract(1, 'days');
  //   const to = moment(this.toDate).add(1, 'days');
  //   this.mealsInPeriod = this.fromDate && this.toDate ?
  //   this.dayMeals.filter(dm => moment(dm.date).isAfter(from) && moment(dm.date).isBefore(to)) : [];
  // }

  stringToDate(dateString: string /*dd-MM-yyyy*/): moment.Moment {
    const parts = dateString.split('-');
    return moment(`${parts[2]}-${parts[1]}-${parts[0]}`);
  }

  get mealsAsStringArrays(): string[][] {
    const strings = [];
    this.mealsInPeriod.forEach(me => {
      const toAdd = [
        me.meal.name,
        me.date,
        me.consumedOnTime,
        this.decimal.transform(me.quantity, '0.0-2').toString() + ' ' + me.unit.toString(),
        this.decimal.transform(me.totalProtein, '0.0-2').toString() + ' ' + 'g',
        this.decimal.transform(me.totalPhenyl, '0.0-2').toString() + ' ' + 'mg'
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
    doc.setFontSize(11);
    doc.text(`Navn: ${!!this.user.userName ? this.user.userName : this.user.email}`, 13, 15);
    doc.text(`Fødselsdato: ${!!this.user.birthDate ? this.datePipe.transform(new Date(this.user.birthDate), 'dd-MM-yyyy') : ''}`, 13, 20);
    // const str = 'Page ' + doc.page  + ' af ' +  this.totalPages;
    // doc.text(str, 50, doc.internal.pageSize.height - 10); // key is the interal pageSize function
    doc.autoTable({
      head: [['Måltid', 'Dato', 'Tidspunkt', 'Mængde', 'Protein indhold', 'Phe indhold']],
      body: [
        ...this.mealsAsStringArrays
      ],
      startY: 25,
      headStyles: {
        fillColor: [103, 58, 183]
      }
    });
    return doc;
  }

  // get totalPages(): number {
  //   return this.mealsAsStringArrays.length / 50 /*rows pr page*/;
  // }
}
