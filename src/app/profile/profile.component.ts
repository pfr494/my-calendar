import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { SnackService } from '../services/snack.service';
import { SimpleUser } from '../models/simple-user.interface';
import { UpdaterService } from '../services/updater/updater.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  pkuControl = new FormControl();
  birthDateControl = new FormControl();
  userNameControl = new FormControl();
  user$: Observable<SimpleUser>;
  loading: boolean;

  constructor(public auth: AuthService, private userService: UserService, private snack: SnackService, public updater: UpdaterService) { }

  ngOnInit() {
    this.user$ = this.userService.getUser();
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
