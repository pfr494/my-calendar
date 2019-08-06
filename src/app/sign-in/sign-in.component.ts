import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { SnackService } from '../services/snack.service';

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
    private snackBar: SnackService) {
    iconRegistry.addSvgIcon(
      'google',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/googleLogo.svg')
    );
    this.userInfo = new UserInfo();
  }

  ngOnInit() {
    this.authService.loggedIn$.subscribe((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        this.ngZone.run(() => {
          this.router.navigate(['myday']);
        });
      }
    });
  }

  signUp() {
    this.authService.emailSignUp(this.userInfo.email, this.userInfo.password)
      .then(() => {
        this.snackBar.showInfo('Bruger oprettet med email: ' + this.userInfo.email, 'Yay!');
        this.router.navigate(['/login']);
      }).catch((err) => {
        this.snackBar.showError(err.message, 'Nay!');
      });
  }

  login() {
    this.authService.emailLogin(this.userInfo.email, this.userInfo.password)
      .then(() => {
        console.log('Sign in: ' + this.userInfo.email + ' ' + this.userInfo.password);
        this.snackBar.showInfo('Bruger med email: ' + this.authService.currentUserMail + ' blev logget ind', 'Yay!');
        this.ngZone.run(() => {
          this.router.navigate(['myday']);
        });
      });
  }

  googleSignIn() {
    this.authService.googleLogin()
      .then(() => {
        this.ngZone.run(() => {
          this.router.navigate(['myday']);
        });
        this.snackBar.showInfo('Bruger med email: ' + this.authService.currentUserMail + ' blev logget ind', 'Yay!');
      }).catch((error) => {
        console.log(error);
        this.router.navigate(['/login']);
      });
  }
}
