import { Injectable, ApplicationRef } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Subscription, interval, concat, BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { SnackService } from '../snack.service';

@Injectable({
  providedIn: 'root'
})
export class UpdaterService {
  updateAvailable$ = new BehaviorSubject<boolean>(false);
  enabled$ = new BehaviorSubject<boolean>(false);
  sub: Subscription;

  constructor(appRef: ApplicationRef, private swUpdate: SwUpdate, private snack: SnackService) {
    // Allow the app to stabilize first, before starting polling for updates with `interval()`.
    this.enabled$.next(this.swUpdate.isEnabled);

    if (this.swUpdate.isEnabled) {
      const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
      const everySixHours$ = interval(6 * 60 * 60 * 1000);
      const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);
      everySixHoursOnceAppIsStable$.subscribe(() => swUpdate.checkForUpdate());
    }
  }

  init() {
    if (this.swUpdate.isEnabled) {
      this.sub = this.swUpdate.available.subscribe(() => {
      this.snack.showInfo('Der er en ny version tilgængelig', 'Opdatér')
      .onAction().subscribe(async () => {
        await this.swUpdate.activateUpdate();
        location.reload();
      });
    });
    }
}

  destroy() {
    if (this.sub) { this.sub.unsubscribe(); }
  }

  checkForUpdate(): Promise<void> {
    return this.swUpdate.checkForUpdate();
  }
}
