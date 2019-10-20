import { Component, OnInit, OnDestroy } from '@angular/core';
import { routerTransition } from './router-animations';
import { UpdaterService } from './services/updater/updater.service';
import { UserService } from './services/user/user.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routerTransition]
})
export class AppComponent implements OnInit, OnDestroy {
  sidenavOpen: boolean;
  isAdmin$: Observable<boolean>;

  constructor(private updater: UpdaterService, private user: UserService) {
    this.isAdmin$ = this.user.currentUser$.pipe(map(u => u.admin));
  }

  ngOnInit(): void {
    this.updater.init();
  }

  ngOnDestroy(): void {
    this.updater.destroy();
    this.user.destroy();
  }
}
