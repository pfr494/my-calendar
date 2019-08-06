import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Output() menuClicked = new EventEmitter<void>();
  canGoBack = false;

  constructor(private router: Router, public auth: AuthService, private location: Location) { }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => {
      this.canGoBack = e.url && !e.url.includes('myday');
    });
  }

  goBack() {
    this.location.back();
  }

  get headerText(): string {
    const url = this.location.path();
    if (url.includes('meal')) {
      return 'Opret Måltid';
    } else if (url.includes('profile')) {
      return 'Min Profil';
    } else if (url.includes('convert')) {
      return 'Omregn';
    } else if (url.includes('print')) {
      return 'Print';
    } else {
      return 'Min PKUalender';
    }
  }
}
