import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map, take, tap } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot, 
        router: RouterStateSnapshot
        ): boolean | Promise<boolean> | Observable<boolean> {
        return this.authService.user.pipe(
            take(1),
            map(
                user => {
                    return !!user;
                }
            ), tap(
                isAuth => {
                    if(!isAuth) {
                        this.router.navigate(['/login']);
                    }
                }
            )
        );
    }

    canLoad(route: Route) {
        return this.authService.user.pipe(
            take(1),
            map(
                user => {
                    return !!user;
                }
            ), tap(
                isAuth => {
                    if(!isAuth) {
                        this.router.navigate(['/login']);
                    }
                }
            )
        );
    }
}