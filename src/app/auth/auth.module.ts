import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from "../shared/shared.module";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptorService } from "./auth.interceptor.service";
import { AuthRoutingModule } from "./auth-routing.module";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule ({
    declarations: [
        SignupComponent,
        LoginComponent
    ],
    imports: [
        ReactiveFormsModule,
        SharedModule,
        AuthRoutingModule
    ],
    exports: [],
    providers: [
        {
          provide: HTTP_INTERCEPTORS, 
          useClass: AuthInterceptorService,
          multi: true
        }
      ]
})
export class AuthModule {}