import { Injectable } from '@angular/core';

declare let gtag: Function;

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  constructor() {}

  public initialize() {
    if (typeof gtag === 'function') {
      gtag('js', new Date());
      gtag('config', 'G-VX68ES4J84');
    }
  }

  public sendPageView(pagePath: string, pageTitle: string) {
    if (typeof gtag === 'function') {
      gtag('config', 'G-VX68ES4J84', {
        page_path: pagePath,
        page_title: pageTitle,
      });
    }
  }

}
