import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth: boolean = false;
  private sub$ = new Subscription();

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.sub$.add(
      this.authService.user.subscribe(user => {
      this.isAuth = !!user;
      })
    );
  }

  ngOnDestroy() {
    if(this.sub$){
      this.sub$.unsubscribe();
    }
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }  

  onLogout() {
    this.authService.logout();
  }
}
