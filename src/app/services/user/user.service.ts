import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { SimpleUser } from 'src/app/models/simple-user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFireDatabase, private auth: AuthService) {}

  getUser(): Observable<SimpleUser> {
    return this.db.object(`users/${this.auth.currentUser.uid}`).valueChanges() as Observable<any>;
  }

  async updateUserPku(pku: number): Promise<any> {
    return this.db.object(`users/${this.auth.currentUser.uid}`).update({ pkuLimit: pku});
  }
}