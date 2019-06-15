import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  authState: any = null;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private router: Router) {

    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
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
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  // Returns current user data
  get currentUser$(): Observable<firebase.User> {
    return this.afAuth.authState;
  }

  // Returns
  get currentUserObservable(): any {
    return this.afAuth.authState;
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  // Returns email as name
  get currentUserMail(): string {
    return this.authState.user ? this.authState.user.email : '';
  }

  // Anonymous User
  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false;
  }

  // Returns current user display name or Guest
  get currentUserDisplayName(): string {
    if (!this.authState) {
      return 'Guest';
    } else if (this.currentUserAnonymous) {
      return 'Anonymous';
    } else {
      return this.authState.displayName || this.authState.email;
    }
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.socialSignIn(provider);
  }

  private socialSignIn(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.authState = credential.user;
        this.updateUserData();
      })
      .catch(error => console.log(error));
  }

  emailSignUp(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user;
        this.updateUserData();
      })
      .catch(error => console.log(error));
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user;
        // this.updateUserData();
      })
      .catch(error => console.log(error));
  }

  resetPassword(email: string) {
    const auth = firebase.auth();

    return auth.sendPasswordResetEmail(email)
      .then(() => console.log('email sent'))
      .catch((error) => console.log(error));
  }


  async signOut() {
    await this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
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
