import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../@Service/auth.service';
import { User } from '../../@Interface/user.interface';

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  public isLoading: boolean;
  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  public onSubmitLogin(form: NgForm) {
    this.isLoading = true;
    if (form.invalid) {
      this.snackBar.open('Töltsd ki a szükséges mezőket!', '', {
        duration: 3000,
        verticalPosition: 'bottom',
        panelClass: ['danger-snackbar'],
      });
      this.isLoading = false;
      return;
    }
    const loggingUser: User = {
      username: form.value.username,
      password: form.value.password,
    };

    this.authService.postLogin(loggingUser);
    this.isLoading = false;
  }

  ngOnDestroy(): void {}
}
