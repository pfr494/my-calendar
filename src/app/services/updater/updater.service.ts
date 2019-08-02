import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class UpdaterService {

  constructor(private swUpdate: SwUpdate, private snack: MatSnackBar) {}

  init() {
    this.swUpdate.available.subscribe(() => {
      this.snack.open('Der er en ny version tilgængelig', 'Opdatér')
      .onAction().subscribe(() => location.reload());
    });
  }
}
