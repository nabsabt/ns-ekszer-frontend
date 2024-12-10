import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';

import { environment } from '../environments/environment';
import { LoginComponent } from './@Component/login.component/login.component';
import { HomeComponent } from './@Component/home.component/home.component';
import { AuthService } from './@Service/auth.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SignupComponent } from './@Component/signup.component/signup.component';
import { NavbarComponent } from './@Component/navbar/navbar.component';
import { AuthInterceptor } from './@Service/auth.interceptor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NSService } from './@Service/nsSrvice';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SignupComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    NSService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {}
}
