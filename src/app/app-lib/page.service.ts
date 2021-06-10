import { Injectable, OnInit } from "@angular/core";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";

type EventType = 'navigatingFrom';

@Injectable({
  providedIn: "root"
})
export class PageService {

  constructor(public router: Router) {
    console.log('PageService', 'ngOnInit');
    this.router.events
      .pipe(
        // takeUntil(this.destroyed)
      )
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          console.log('NAVIGATING AWAY', event);
        }
        else if (event instanceof NavigationEnd) {
          console.log('NAVIGATING ON', event);
        }
      });
  }

  on(event: EventType) {

  }
}
