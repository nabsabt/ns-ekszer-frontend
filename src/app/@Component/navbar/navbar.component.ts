import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../@Service/auth.service';
import { tokenPayload } from '../../@Interface/user.interface';

@Component({
  selector: 'navbar-component',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  private userDataListenerSub: Subscription;

  public isLoggedIn: boolean;
  public username: string = localStorage.getItem('username') || '';
  public role: string = localStorage.getItem('role') || '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.getIsAuth();

    this.userDataListenerSub = this.authService
      .getUserInfoListener()
      .subscribe({
        next: (res: tokenPayload | null) => {
          this.isLoggedIn = res ? true : false;

          this.username = res ? res.username : '';
          this.role = res ? res.role : '';
        },
      });
  }

  public logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    if (this.userDataListenerSub) {
      this.userDataListenerSub.unsubscribe();
    }
  }
}
