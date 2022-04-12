import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  private subscription: Subscription
  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.subscription = this.authService.user.subscribe(user => {
      this.isAuth = !!user;
    })
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
