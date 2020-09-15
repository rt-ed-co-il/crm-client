import {Injectable} from '@angular/core'

@Injectable({providedIn: 'root'})
export class AuthService {
  private isAuth = false

  login() {
    this.isAuth = true
  }

  logout() {
    sessionStorage.clear();
    this.isAuth = false
  }

  isAuthenticated() {
    return this.isAuth
  }
}
