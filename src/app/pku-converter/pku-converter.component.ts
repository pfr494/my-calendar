import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pku-converter',
  templateUrl: './pku-converter.component.html',
  styleUrls: ['./pku-converter.component.scss']
})
export class PkuConverterComponent implements OnInit {
  protein: number;
  phenylalanin: number;
  list: number;

  get calculatedProtein(): number {
    return this.roundedPhenyl / 50;
  }

  get calculatedPhenylalanin(): number {
    return this.roundedProtein * 50;
  }

  get calculatedLists(): number {
    return (25 / this.calculatedPhenylalanin) * 100;
  }

  constructor() { }

  ngOnInit() {
  }

  get roundedProtein(): number {
    return Number(String(this.protein).replace(',', '.'));
  }

  get roundedPhenyl(): number {
    return Number(String(this.phenylalanin).replace(',', '.'));
  }

}
