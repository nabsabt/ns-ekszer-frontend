import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './@Component/home.component/home.component';
import { LoginComponent } from './@Component/login.component/login.component';
import { SignupComponent } from './@Component/signup.component/signup.component';
import { AuthGuard } from './@Service/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  /*   {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [AuthGuard],
  }, */
  {
    path: '**',
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
