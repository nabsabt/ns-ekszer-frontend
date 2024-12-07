import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  LoginResponseInterface,
  tokenPayload,
  User,
} from '../@Interface/user.interface';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  private token: string | null;
  private tokenTimer: any;

  private isAuthenticated: boolean;
  private authStatusListener = new Subject<boolean>();
  private userInfoListener = new Subject<tokenPayload | null>();

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  public getToken() {
    return this.token;
  }

  public getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  public getUserInfoListener() {
    return this.userInfoListener.asObservable();
  }

  public getIsAuth() {
    return this.isAuthenticated;
  }

  public postLogin(user: User) {
    this.http
      .post<LoginResponseInterface>(`${environment.apiURL}/auth/login`, {
        user,
      })
      .subscribe({
        next: (res: LoginResponseInterface) => {
          this.snackBar.open(res.message, '', {
            duration: 3000,
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar'],
          });
          this.token = res.token;
          if (res.token) {
            const expiresInDuration = res.tokenExpiresIn;
            /**
             * logs out if token expired->
             */
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.userInfoListener.next(res.userData);

            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthDataToLocalStorage(
              res.token,
              res.userData.username,
              res.userData.role,
              expirationDate
            );

            this.router.navigate(['home']);
          }
        },
        error: (error: HttpErrorResponse): HttpErrorResponse => {
          this.snackBar.open(error.error.message, '', {
            duration: 3000,
            verticalPosition: 'bottom',
            panelClass: ['danger-snackbar'],
          });
          return error;
        },
      });
  }

  public postSignup(user: User): Observable<{ status: string }> {
    console.log('serv lefut, ', `${environment.apiURL}/auth/signup`);
    return this.http.post<{ status: string }>(
      `${environment.apiURL}/auth/signup`,
      {
        user,
      }
    );
  }

  /**
   * TOKEN/AUTH expiration helper methods->
   */

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private clearAuthDataFromLocalStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('expiration');
  }

  private saveAuthDataToLocalStorage(
    token: string,
    username: string,
    role: string,
    expirationDate: Date
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  public autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    /**
     * check, if expiration date is still "in the future"->
     */
    const now = new Date();
    if (
      authInformation?.expirationDate &&
      authInformation.username &&
      authInformation.role
    ) {
      const expiresIn =
        authInformation?.expirationDate.getTime() - now.getTime();
      if (expiresIn > 0) {
        this.token = authInformation?.token;
        this.isAuthenticated = true;
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListener.next(true);

        this.userInfoListener.next({
          username: authInformation.username,
          role: authInformation.role,
        });
      }
    }
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const expirationDate = localStorage.getItem('expiration');

    if (!token && !expirationDate) {
      return {};
    }
    if (expirationDate) {
      return {
        token: token,
        username: username,
        role: role,
        expirationDate: new Date(expirationDate),
      };
    } else {
      return;
    }
  }

  public logout() {
    this.token = null;
    this.authStatusListener.next(false);
    this.userInfoListener.next(null);
    this.clearAuthDataFromLocalStorage();
    clearTimeout(this.tokenTimer);
    this.router.navigate(['login']);
  }
}
