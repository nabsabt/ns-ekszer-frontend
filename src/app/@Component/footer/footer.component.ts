import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'footer-component',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  standalone: true,
  imports: [],
})
export class FooterComponent implements OnInit {
  public year: number = new Date().getFullYear();
  constructor() {}
  ngOnInit(): void {}
}
