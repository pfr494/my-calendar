import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { SimpleUser } from 'src/app/models/simple-user.interface';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFireDatabase, private auth: AuthService, private datepipe: DatePipe) {}

  getUser(): Observable<SimpleUser> {
    return this.db.object(`users/${this.auth.currentUser.uid}`).valueChanges() as Observable<any>;
  }

  async updateUsername(userName: string): Promise<any> {
    return this.db.object(`users/${this.auth.currentUser.uid}`).update({ userName });
  }

  async updateBirthdate(date: Date): Promise<any> {
    // const d = this.datepipe.transform(date, 'dd-MM-yyyy');
    return this.db.object(`users/${this.auth.currentUser.uid}`).update({ birthDate: date.toISOString() });
  }

  async updateUserPku(pkuLimit: number): Promise<any> {
    return this.db.object(`users/${this.auth.currentUser.uid}`).update({ pkuLimit });
  }
}
