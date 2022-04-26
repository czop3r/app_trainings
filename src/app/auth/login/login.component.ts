import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
  private sub$ = new Subscription();

  constructor(private authService: AuthService) { }

  ngOnDestroy() {
    if(this.sub$) {
      this.sub$.unsubscribe()
    }
  }

  onSubmit(form: NgForm) {
    this.sub$.add(
      this.authService.login({
        email: form.value.email,
        password: form.value.password
      }).subscribe()
    );
  }
}
