import { Injectable, ApplicationRef } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';
import { Subscription, interval, concat } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UpdaterService {
  sub: Subscription;

  constructor(appRef: ApplicationRef, private swUpdate: SwUpdate, private snack: MatSnackBar) {
    // Allow the app to stabilize first, before starting polling for updates with `interval()`.
    const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    everySixHoursOnceAppIsStable$.subscribe(() => swUpdate.checkForUpdate());
  }

  init() {
    this.sub = this.swUpdate.available.subscribe(() => {
      this.snack.open('Der er en ny version tilgængelig', 'Opdatér', { verticalPosition: 'top' })
      .onAction().subscribe(async () => {
        await this.swUpdate.activateUpdate();
        location.reload();
      });
  });
}

  destroy() {
    if (this.sub) { this.sub.unsubscribe(); }
  }
}
