import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { SnackService } from '../services/snack.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  pkuControl = new FormControl();
  user$: Observable<any>;
  loading: boolean;

  constructor(public auth: AuthService, private user: UserService, private snack: SnackService) { }

  ngOnInit() {
    this.user$ = this.user.getUser();
  }

  async updateLimit() {
    try {
      this.loading = true;
      await this.user.updateUserPku(this.pkuControl.value);
      this.snack.showInfo(`PKU tolerance opdateret til: ${this.pkuControl.value}`);
    } finally {
      this.loading = false;
      this.pkuControl.markAsPristine();
    }
  }

  logout() {
    this.auth.signOut();
  }
}
