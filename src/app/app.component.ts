import { Component, OnInit } from '@angular/core';
import { AuthService } from './@Service/auth.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public isUnderDevelopment: boolean = environment.isUnderDevelopment;

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authService.autoAuthUser();
  }
}
