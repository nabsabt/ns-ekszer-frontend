import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../@Service/auth.service';
import { tokenPayload } from '../../@Interface/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'navbar-component',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild('navbarSupportedContent') navbarSupportedContent: ElementRef;

  private userDataListenerSub: Subscription;

  public isLoggedIn: boolean;
  public username: string = localStorage.getItem('username') || '';
  public role: string = localStorage.getItem('role') || '';

  private pressTimer: any; // To hold the timer reference
  private holdTime = 3500; // 5 seconds in milliseconds

  constructor(private authService: AuthService, private router: Router) {}

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

  public collapseNavbar() {
    const navbar = this.navbarSupportedContent.nativeElement;
    if (navbar.classList.contains('show')) {
      navbar.classList.remove('show');
    }
  }

  public startLoginNavigationPress(): void {
    this.pressTimer = setTimeout(() => {
      this.onHoldComplete();
    }, this.holdTime);
  }

  public endLoginNavigationPress(): void {
    clearTimeout(this.pressTimer); // Clear the timer if the user releases the button early
  }

  // Event to execute after successful hold
  public onHoldComplete(): void {
    this.collapseNavbar();
    if (!this.isLoggedIn) {
      this.router.navigate(['login']);
    }
  }

  public logout() {
    this.collapseNavbar();
    this.authService.logout();
  }

  ngOnDestroy(): void {
    if (this.userDataListenerSub) {
      this.userDataListenerSub.unsubscribe();
    }
  }
}
