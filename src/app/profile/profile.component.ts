import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';
import { Observable, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { SnackService } from '../services/snack.service';
import { SimpleUser } from '../models/simple-user.interface';
import { UpdaterService } from '../services/updater/updater.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  pkuControl = new FormControl();
  birthDateControl = new FormControl();
  userNameControl = new FormControl();
  user$: Observable<SimpleUser>;
  updateAvailable: boolean;
  checking: boolean;
  loading: boolean;
  birthDate: Date;

  constructor(public auth: AuthService, private userService: UserService, private snack: SnackService, public updater: UpdaterService) { }

  ngOnInit() {
    this.user$ = this.userService.currentUser$.pipe(filter(u => !!u));
    this.subs = [
      this.user$.subscribe(u => this.birthDate = u.birthDate)
    ];
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  async checkForUpdate() {
    try {
      this.checking = true;
      await this.updater.checkForUpdate();
      setTimeout(() => {
        if (!this.updateAvailable) {
          this.snack.showInfo('Du har allerede den nyeste version', 'OK');
        }
        this.checking = false;
      }, 1000);
    } finally {}
  }

  async saveInformation() {
    if (this.userNameControl.dirty) {
      this.updateUserName();
    }
    if (this.birthDateControl.dirty) {
      this.updateBirthDate();
    }
    if (this.pkuControl.dirty) {
      this.updateLimit();
    }
  }

  async updateUserName() {
    try {
      this.loading = true;
      await this.userService.updateUsername(this.userNameControl.value);
      this.snack.showInfo(`Brugernavn sat til: ${this.userNameControl.value}`);
    } finally {
      this.loading = false;
      this.userNameControl.markAsPristine();
    }
  }
  async updateBirthDate() {
    try {
      this.loading = true;
      await this.userService.updateBirthdate(this.birthDateControl.value);
      this.snack.showInfo(`Fødselsdag sat til: ${this.birthDateControl.value}`);
    } finally {
      this.loading = false;
      this.birthDateControl.markAsPristine();
    }
  }
  async updateLimit() {
    try {
      this.loading = true;
      await this.userService.updateUserPku(this.pkuControl.value);
      this.snack.showInfo(`PKU tolerance sat til: ${this.pkuControl.value}`);
    } finally {
      this.loading = false;
      this.pkuControl.markAsPristine();
    }
  }

  getDate(s: string) {
    return new Date(s);
  }

  installUpdate() {
    location.reload();
  }

  logout() {
    this.auth.signOut();
  }
}
