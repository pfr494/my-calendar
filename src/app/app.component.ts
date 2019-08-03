import { Component, OnInit, OnDestroy } from '@angular/core';
import { routerTransition } from './router-animations';
import { UpdaterService } from './services/updater/updater.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routerTransition]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'my-calendar';

  constructor(private updater: UpdaterService) { }

  ngOnInit(): void {
    this.updater.init();
  }

  ngOnDestroy(): void {
    this.updater.destroy();
  }

  getState(outlet) {
    return outlet.activatedRouteData.state;
  }
}
