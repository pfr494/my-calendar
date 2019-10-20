import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

const START_PAGE = 'myday';

@Injectable()
export class AuthService {
  authState: firebase.User = null;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.authState.subscribe((user) => {
      this.authState = user;
    });
  }

  get loggedIn$(): Observable<boolean> {
    return this.afAuth.authState.pipe(map(auth => !!auth));
  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user data
  get currentUser(): firebase.User {
    return this.authenticated ? this.authState : null;
  }

  // Returns current user data
  get currentUser$(): Observable<firebase.User> {
    return this.afAuth.authState;
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  // Returns email as name
  get currentUserMail(): string {
    return this.authState ? this.authState.email : '';
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.socialSignIn(provider);
  }

  private async socialSignIn(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.authState = credential.user;
        this.updateUserData();
      });
  }

  async emailSignUp(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((credential) => {
        this.authState = credential.user;
        this.updateUserData();
      });
  }

  async emailLogin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((credential) => {
        this.authState = credential.user;
        this.updateUserData();
      });
  }

  async resetPassword(email: string) {
    const auth = firebase.auth();
    return auth.sendPasswordResetEmail(email);
  }


  async signOut() {
    await this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
    location.reload();
  }

  private updateUserData(): void {
    const path = `users/${this.currentUserId}`;
    const data = {
      email: this.authState.email,
      name: this.authState.displayName
    };

    this.db.object(path).update(data)
      .catch(error => console.log(error));

  }
}
