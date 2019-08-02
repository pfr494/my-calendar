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
    return this.phenylalanin / 50;
  }

  get calculatedPhenylalanin(): number {
    return this.protein * 50;
  }
  
  get calculatedLists(): number {
    return (25 / this.calculatedPhenylalanin) * 100;
  }

  constructor() { }

  ngOnInit() {
  }

}
