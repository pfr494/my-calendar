import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '../auth/auth.service';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { SimpleUser } from 'src/app/models/simple-user.interface';
import { filter } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';

const initialUser = {
  admin: false,
  pkuLimit: 0,
  userName: '',
  email: ''
} as SimpleUser;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private subs: Subscription[] = [];
  currentUser$ = new BehaviorSubject<SimpleUser>(initialUser);
  currentUser: SimpleUser;
  setCurrentUser(u: SimpleUser) {
    this.currentUser = u;
    this.currentUser$.next(this.currentUser);
  }

  constructor(private db: AngularFireDatabase, private auth: AuthService) {
    this.subs.push(this.auth.currentUser$.pipe(filter(u => !isNullOrUndefined(u))).subscribe((user) => {
      this.subs.push(this.getUser().subscribe(u => this.setCurrentUser(u)));
    }));
  }

  destroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  private getUser(): Observable<SimpleUser> {

    return this.db.object(`users/${this.auth.currentUser.uid}`).valueChanges() as Observable<any>;
  }

  async updateUsername(userName: string): Promise<any> {
    return this.db.object(`users/${this.auth.currentUser.uid}`).update({ userName });
  }

  async updateBirthdate(date: Date): Promise<any> {
    return this.db.object(`users/${this.auth.currentUser.uid}`).update({ birthDate: date.toISOString() });
  }

  async updateUserPku(pkuLimit: number): Promise<any> {
    return this.db.object(`users/${this.auth.currentUser.uid}`).update({ pkuLimit });
  }
}
