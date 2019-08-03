import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdaterService {
  sub: Subscription;

  constructor(private swUpdate: SwUpdate, private snack: MatSnackBar) {}

  init() {
    if (this.swUpdate.isEnabled) {
      this.sub = this.swUpdate.available.subscribe(() => {
        this.snack.open('Der er en ny version tilgængelig', 'Opdatér')
        .onAction().subscribe(() => location.reload());
      });
    }
  }

  destroy() {
    if (this.sub) { this.sub.unsubscribe() };
  }
}
