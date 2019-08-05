import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SnackService {

  constructor(private snack: MatSnackBar) { }

  showInfo(message: string, action: string = 'OK', timeout: number = 3000, pos: 'top' | 'bottom' = 'top'): MatSnackBarRef<SimpleSnackBar> {
    return this.snack.open(message, action, {
      verticalPosition: pos,
      duration: timeout,
      panelClass: ['info-snack']
    });
  }

  showError(message: string, action: string = 'ØV',  timeout: number = 3000, pos: 'top' | 'bottom' = 'top'): MatSnackBarRef<SimpleSnackBar> {
    return this.snack.open(message, action, {
      verticalPosition: pos,
      duration: timeout,
      panelClass: ['error-snack']
    });
  }
}
