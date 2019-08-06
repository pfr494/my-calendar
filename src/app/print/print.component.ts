import { Component, OnInit, OnDestroy } from '@angular/core';


import { MealService } from '../services/meal/meal.service';
import { DatePipe } from '@angular/common';

import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Subscription } from 'rxjs';
import { DayMeal } from '../models/day-meal.interface';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss'],
  providers: [DatePipe]
})
export class PrintComponent implements OnDestroy {
  sub: Subscription;
  selectedMeals: DayMeal[];

  constructor(public meals: MealService, private datePipe: DatePipe) {
    this.sub = this.meals.selectedDateMeal$.subscribe(m => this.selectedMeals = m);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  get mealsAsStringArrays(): string[][] {
    const strings = [];
    this.selectedMeals.forEach(me => {
      // const toAdd = Object.values(me).map((v: string | number) => v.toString());
      const toAdd = [
        me.meal.name,
        this.datePipe.transform(this.meals.selectedDate, 'dd-MM-yyyy'),
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
    doc.save(`pku-udskrift${this.datePipe.transform(this.meals.selectedDate, 'dd-MM-yyyy')}.pdf`);
  }

  share() {
    const nav: any = navigator;
    const doc = this.generatePdfDoc() as jsPDF;
    const url = doc.output('datauristring');
    if (nav.share) {
      nav.share({
          title: 'PKU Udskrift',
          text: `pku-udskrift${this.datePipe.transform(this.meals.selectedDate, 'dd-MM-yyyy')}.pdf`,
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
