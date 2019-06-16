import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  pkuControl = new FormControl();
  user$: Observable<any>;
  loading: boolean;

  constructor(public auth: AuthService, private user: UserService) { }

  ngOnInit() {
    this.user$ = this.user.getUser();
  }

  async updateLimit(limit: number) {
    try {
      this.loading = true;
      const toUpdate = {
        name: this.auth.currentUser.displayName,
        email: this.auth.currentUser.email,
        pkuLimit: limit
      };
      await this.user.updateUser(toUpdate);
    } finally {
      this.loading = false;
    }
  }

  logout() {
    this.auth.signOut();
  }
}
