import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy{
  private sub$ = new Subscription();
  maxDate;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  ngOnDestroy() {
    if(this.sub$) {
      this.sub$.unsubscribe()
    }
  }

  onSubmit(form: NgForm) {
    this.sub$.add(
      this.authService.registerUser({
        email: form.value.email,
        password: form.value.password
      }).subscribe()
    );
  }
}
