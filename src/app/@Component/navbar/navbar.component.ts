import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'navbar-component',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild('navbarSupportedContent') navbarSupportedContent: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  public collapseNavbar() {
    const navbar = this.navbarSupportedContent.nativeElement;
    if (navbar.classList.contains('show')) {
      navbar.classList.remove('show');
    }
  }

  ngOnDestroy(): void {}
}
