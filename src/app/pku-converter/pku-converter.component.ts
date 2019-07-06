import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pku-converter',
  templateUrl: './pku-converter.component.html',
  styleUrls: ['./pku-converter.component.scss']
})
export class PkuConverterComponent implements OnInit {
  protein: number;
  phenylalanin: number;
  quantityProtein = 1;
  quantityPhenylalanin = 1;

  get calculatedProtein(): number {
    return (this.phenylalanin * this.quantityProtein) / 50;
  }
  get calculatedPhenylalanin(): number {
    return (this.protein * this.quantityPhenylalanin) * 50;
  }
  constructor() { }

  ngOnInit() {
  }

}
