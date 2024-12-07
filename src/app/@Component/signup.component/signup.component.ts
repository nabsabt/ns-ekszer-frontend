import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../@Service/auth.service';
import { User } from '../../@Interface/user.interface';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'signup-component',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnDestroy {
  private submitRegSub: Subscription;

  public isLoading: boolean;
  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  public onSubmitRegistration(form: NgForm) {
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

    if (form.value.password !== form.value.passwordConfirm) {
      this.snackBar.open('A két jelszó nem egyezik!', '', {
        duration: 3000,
        verticalPosition: 'bottom',
        panelClass: ['danger-snackbar'],
      });
      this.isLoading = false;
      return;
    }
    const newUser: User = {
      username: form.value.username,
      password: form.value.password,
    };

    this.submitRegSub = this.authService.postSignup(newUser).subscribe({
      next: (res) => {
        this.snackBar.open(res.status, '', {
          duration: 3000,
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar'],
        });
        this.isLoading = false;
        this.router.navigate(['']);
        return;
      },
      error: (error: HttpErrorResponse): HttpErrorResponse => {
        this.snackBar.open(error.error.message, '', {
          duration: 3000,
          verticalPosition: 'bottom',
          panelClass: ['danger-snackbar'],
        });
        this.isLoading = false;
        return error;
      },
    });
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    if (this.submitRegSub) {
      this.submitRegSub.unsubscribe();
    }
  }
}
