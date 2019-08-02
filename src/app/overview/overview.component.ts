import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  @HostListener('document:keydown', ['$event'])
  onkeydown(e: KeyboardEvent){
    if (e.key==='+'){
      this.router.navigate(['meal']);
    }
  }
}
