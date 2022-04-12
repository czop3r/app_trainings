import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  private subscription: Subscription
  @Output() sidenavClose = new EventEmitter<void>();
  isAuth: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.subscription = this.authService.user.subscribe(user => {
      this.isAuth = !!user;
    })
  }

  onClose() {
    this.sidenavClose.emit();
  }

  onLogout() {
    this.onClose();
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
