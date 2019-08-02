import { Component } from '@angular/core';
import { routerTransition } from './router-animations';
import { UpdaterService } from './services/updater/updater.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routerTransition]
})
export class AppComponent {
  title = 'my-calendar';

  constructor(private updater: UpdaterService) {}

  getState(outlet) {
    return outlet.activatedRouteData.state;
  }
}
