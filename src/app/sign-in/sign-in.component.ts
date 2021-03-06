import { AuthService } from '../services/auth/auth.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackService } from '../services/snack.service';
import { MatIconRegistry } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

const START_PAGE = 'myday';

interface UserInfo {
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
    private route: ActivatedRoute,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private snackBar: SnackService) {
    iconRegistry.addSvgIcon(
      'google',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/googleLogo.svg')
    );
    this.userInfo = {
      email: null,
      password: null
    };
  }

  ngOnInit() {
    this.authService.loggedIn$.subscribe((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        this.ngZone.run(() => {
          const route = this.route.snapshot.queryParams.returnUrl;
          if (route) {
            this.router.navigate([route]);
          }
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
        this.ngZone.run(() => {
          this.router.navigate([START_PAGE]);
        });
        this.snackBar.showInfo('Bruger med email: ' + this.authService.currentUserMail + ' blev logget ind', 'Yay!');
      })
      .catch((err) => {
        this.snackBar.showError(err.message, 'Nay!');
      });
  }

  googleSignIn() {
    this.authService.googleLogin()
      .then(() => {
        this.ngZone.run(() => {
          this.router.navigate([START_PAGE]);
        });
        this.snackBar.showInfo('Bruger med email: ' + this.authService.currentUserMail + ' blev logget ind', 'Yay!');
      }).catch((err) => {
        this.snackBar.showError(err.message, 'Nay!');
      });
  }
}
