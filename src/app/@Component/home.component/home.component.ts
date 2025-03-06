import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'home-component',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private isMobileView: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver
      .observe('(max-width: 765px)')
      .subscribe((result) => {
        this.isMobileView = result.matches;
      });
  }

  ngOnInit() {
    this.activatedRoute.fragment.subscribe((fragment: string | null) => {
      if (fragment) this.jumpToSection(fragment);
    });
  }

  jumpToSection(section: string | null) {
    /**Desktop view */
    if (section && !this.isMobileView) {
      document.getElementById(section)?.scrollIntoView({
        behavior: 'smooth',
        block: section !== 'jewelryMaking' ? 'center' : 'start',
      });
    } else if (section && this.isMobileView) {
      /**Mobile view */
      document.getElementById(section)?.scrollIntoView({
        behavior: 'smooth',
        block: section !== 'goldAndJewelAcquisition' ? 'start' : 'center',
      });
    }
  }

  public openCatalog() {
    const pdfUrl = environment.catalogPath + new Date().getTime();
    window.open(pdfUrl, '_blank');
  }

  public ngOnDestroy(): void {}
}
