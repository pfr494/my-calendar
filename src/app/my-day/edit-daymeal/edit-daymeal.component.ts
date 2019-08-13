import { Component, OnInit, Input, EventEmitter, Output, ViewChild, OnDestroy } from '@angular/core';
import { DayMeal } from 'src/app/models/day-meal.interface';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { Unit } from 'src/app/models/unit.enum';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-daymeal',
  templateUrl: './edit-daymeal.component.html',
  styleUrls: ['./edit-daymeal.component.scss']
})
export class EditDaymealComponent implements OnInit, OnDestroy {
  @ViewChild('form', { static: true }) form: NgForm;
  @Input() dayMeal: DayMeal;
  @Output() updateMeal = new EventEmitter<DayMeal>();
  subs: Subscription[];
  dayMealEdit: DayMeal;

  time = new Date();
  units = [ Unit.G, Unit.ML, Unit.STK ];

  theme: NgxMaterialTimepickerTheme = {
    clockFace: {
      clockFaceBackgroundColor: 'white',
      clockHandColor: '#673Ab7'
    },
    container: {
      buttonColor: '#673Ab7',
    }
  };

  constructor() { }

  ngOnInit() {
    this.dayMealEdit = Object.assign({}, this.dayMeal);
    // this.subs = [
    //   this.form.valueChanges.subscribe(() => this.dayMealChange.emit(this.dayMealEdit))
    // ];
  }

  ngOnDestroy() {
    // this.subs.forEach(s => s.unsubscribe());
  }

  updateTime(e: string) {
    this.dayMealEdit.consumedOnTime = e;
  }

}
