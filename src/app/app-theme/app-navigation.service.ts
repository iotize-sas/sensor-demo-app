import { Injectable, NgZone } from "@angular/core";
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationError,
  NavigationCancel,
  Event as RouterEvent
} from "@angular/router";
import getDebugger from "src/app/logger";
import {
  filter,
  first,
  timeout,
  catchError,
  tap,
  share,
  concat
} from "rxjs/operators";
import { Observable, of, from, defer, BehaviorSubject } from "rxjs";
let debug = getDebugger("AppNavigationService");

@Injectable({
  providedIn: "root"
})
export class AppNavigationService {
  private _event: RouterEvent;
  private _events: Observable<RouterEvent>;
  private _loading$ = new BehaviorSubject<boolean>(false);

  public get isLoading(): boolean {
    return this._loading$.value;
  }

  public get loading(): Observable<boolean> {
    return this._loading$;
  }

  constructor(public router: Router, public zone: NgZone) {
    this._events = this.router.events;
    this._events.subscribe((event: RouterEvent) => {
      this._event = event;
      // debug('Navigation event', event);
      if (event instanceof NavigationStart) {
        debug("Application is loading...");
        this._loading$.next(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        debug("Application load end..");
        this._loading$.next(false);
      }
    });
  }

  // waitForNavigationEnd(url: string, timeoutMs: number): Observable<any> {
  //   debug('waitForNavigationEnd: Waiting for navigation end...');
  //   let obs = this._events.pipe(
  //     filter<NavigationEnd>((event: RouterEvent) => {
  //       let isEnded = (event instanceof NavigationEnd) || (event instanceof NavigationError) || (event instanceof NavigationCancel);
  //       debug('waitForNavigationEnd received new event: ', event, isEnded, 'last event', this._event);
  //       return isEnded;
  //     }),
  //     first(),
  //     timeout(timeoutMs),
  //     catchError((err) => {
  //       debug('waitForNavigationEnd timeout', err);
  //       return of(this._event);
  //     })
  //   );
  //   return defer(
  //     () => {
  //       debug('Navigating to ', url);
  //       return this.router.navigateByUrl(url)
  //     }
  //   ).pipe(concat(obs));
  // }

  waitForNavigationEnd(url: string, timeoutMs: number): Observable<any> {
    return defer(() => {
      debug("Navigating to ", url);
      return this.zone.run(() => this.router.navigateByUrl(url));
    }).pipe(timeout(timeoutMs));
  }
}
