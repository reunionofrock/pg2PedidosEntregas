
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'environments/environment';
import {UserService} from './user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<UserService>;
  public currentUser: Observable<UserService>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<UserService>(
      JSON.parse(localStorage.getItem('PATETHRON'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserService {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/User/login`, {
        username,
        password
      })
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes

          localStorage.setItem('PATETHRON', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  logout() {
    localStorage.clear();
    // remove user from local storage to log user out
    //localStorage.removeItem('PATETHRON');
    this.currentUserSubject.next(null);
    return of({ success: false });
  }
}
