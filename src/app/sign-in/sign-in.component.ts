import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { MatSnackBar } from '@angular/material';

class UserInfo {
  email: string;
  password: string;
}

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  userInfo: UserInfo;

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private snackBar: MatSnackBar) {
    iconRegistry.addSvgIcon(
      'google',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/googleLogo.svg')
    );
    this.userInfo = new UserInfo();
  }

  ngOnInit() {
    if (this.authService.authenticated) {
      this.ngZone.run(() => {
        this.router.navigate(['calendar']);
      });
    }
  }

  signUp() {
    this.authService.emailSignUp(this.userInfo.email, this.userInfo.password)
      .then(() => {
        this.snackBar.open('Created user with email: ' + this.userInfo.email, 'Yay!', {
          duration: 2000,
        });
        this.router.navigate(['/login']);
      }).catch((err) => {
        this.snackBar.open(err.message, 'Nay!', {
          duration: 2000,
        });
      });
  }

  login() {
    this.authService.emailLogin(this.userInfo.email, this.userInfo.password)
      .then(() => {
        console.log('Sign in: ' + this.userInfo.email + ' ' + this.userInfo.password);
        this.snackBar.open('User with email: ' + this.authService.currentUserMail + ' logged in', 'Yay!', {
          duration: 2000,
        });
        this.ngZone.run(() => {
          this.router.navigate(['calendar']);
        });
      });
  }

  googleSignIn() {
    this.authService.googleLogin()
      .then(() => {
        this.ngZone.run(() => {
          this.router.navigate(['calendar']);
        });
        this.snackBar.open('User with email: ' + this.authService.currentUserMail + ' logged in', 'Yay!', {
          duration: 2000,
        });
      }).catch((error) => {
        console.log(error);
        this.router.navigate(['/login']);
      });
  }
}
