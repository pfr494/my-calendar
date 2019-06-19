import { Component, OnInit, OnDestroy } from '@angular/core';
import { Meal } from '../models/meal.interface';
import { UserService } from '../services/user/user.service';
import { Subscription } from 'rxjs';
import { SimpleUser } from '../models/simple-user.interface';

@Component({
  selector: 'app-my-day',
  templateUrl: './my-day.component.html',
  styleUrls: ['./my-day.component.scss']
})
export class MyDayComponent implements OnInit, OnDestroy {
  private subs: Subscription[];
  userPkuLimit: number;
  meals: Meal[] = [];

  constructor(private user: UserService) {
    this.subs = [
      this.user.getUser().subscribe((u: SimpleUser) => this.userPkuLimit = u.pkuLimit)
    ];
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    for (const s of this.subs) {
      s.unsubscribe();
    }
  }

  get remainingPhenyl(): number {
    return this.userPkuLimit - this.totalPhenylInMeals;
  }

  get totalPhenylInMeals(): number {
    let tot = 0;
    for (const m of this.meals) {
      tot += m.totalPhenyl;
    }
    return tot;
  }
}
