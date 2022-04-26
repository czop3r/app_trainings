import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() sidenavClose = new EventEmitter<void>();
  isAuth: boolean = false;
  private sub$ = new Subscription();

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.sub$.add(
      this.authService.user.subscribe(user => {
        this.isAuth = !!user;
      })
    ) ;
  }

  ngOnDestroy(): void {
    if(this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onClose() {
    this.sidenavClose.emit();
  }

  onLogout() {
    this.onClose();
    this.authService.logout();
  }
}
