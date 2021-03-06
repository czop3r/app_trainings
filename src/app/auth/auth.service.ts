import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, Observable, Subject, tap, throwError } from "rxjs";
import { environment } from "src/environments/environment";

import { UIService } from "../shared/UI.service";
import { AuthData } from "./auth-data.model";
import { User } from "./user.model";

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

const api_path = 'https://identitytoolkit.googleapis.com/v1/';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    authChange = new Subject<boolean>();
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;


    constructor(
        private router: Router,
        private http: HttpClient,
        private uiService: UIService
        ) {}
    
    registerUser(authData: AuthData): Observable<AuthResponseData> {
        return this.http.post<AuthResponseData>(api_path + 'accounts:signUp?key=' + environment.firebaseAPIKey, {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true
        }).pipe(catchError(err => {
            this.handleError(err);
            return throwError(err);
        }),
            tap(resData => {
                this.handleAuthentication(
                    resData.email,
                    resData.localId,
                    resData.idToken,
                    +resData.expiresIn
                );
                this.authSuccessfully();
            })
        );
    }
    
    login(authData: AuthData): Observable<AuthResponseData> {
        return this.http.post<AuthResponseData>(api_path + 'accounts:signInWithPassword?key=' + environment.firebaseAPIKey, {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true
        }).pipe(catchError(err => {
            this.handleError(err);
            return throwError(err);
        }),
            tap(resData => {
                this.handleAuthentication(
                    resData.email,
                    resData.localId,
                    resData.idToken,
                    +resData.expiresIn
                );
                this.authSuccessfully();
            })
        );
    }

    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if(!userData) {
            return;
        }

        const loadedUser = new User(
            userData.email, 
            userData.id, 
            userData._token, 
            new Date(userData._tokenExpirationDate)
        );

        if(loadedUser.token) {
            this.authChange.next(true);
            this.user.next(loadedUser);
            const expDuration = 
            new Date(userData._tokenExpirationDate).getTime() - 
            new Date().getTime();
            this.autoLogout(expDuration);
        }
    }
    
    logout() {
        this.user.next(null);
        this.authChange.next(false);
        this.router.navigate(['/login']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    private authSuccessfully() {
        this.authChange.next(true);
        this.router.navigate(['/training']);
    }

    private handleAuthentication(
        email: string, 
        userId: string, 
        token: string, 
        expiresIn: number
    ) {
        const expirationDate = new Date(
            new Date().getTime() + expiresIn * 1000
        );
        const user = new User(
            email, 
            userId, 
            token, 
            expirationDate
        );
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes: HttpErrorResponse): void {
        let errorMessage = 'An unknow error occurred!';
        if (!errorRes.error || !errorRes.error.error) {
            return this.uiService.openSnackBar(errorMessage, 'close', 3000);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists arledy';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct';
                break;
          }
          return this.uiService.openSnackBar(errorMessage, 'close', 3000);
    }
}