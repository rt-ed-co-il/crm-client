import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class IsLoggedService {
  constructor() { }
  isUserLoggedIn = new Subject();
  setUserLoggedIn(loggedIn: boolean) {
    return this.isUserLoggedIn.next(loggedIn);
  }
}
